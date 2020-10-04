// This example demonstrates how to authenticate with Spotify.
// In order to run this example yourself, you'll need to:
//
//  1. Register an application at: https://developer.spotify.com/my-applications/
//       - Use "http://localhost:8080/callback" as the redirect URI
//  2. Set the SPOTIFY_ID environment variable to the client ID you got in step 1.
//  3. Set the SPOTIFY_SECRET environment variable to the client secret from step 1.
package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/mux"

	"./stringgen"
	"./websocket"

	"github.com/zmb3/spotify"
)

type secretsJSON struct {
	ClientID string `json:clientID`
	SecretID string `json:secretID`
}

// redirectURI is the OAuth redirect URI for the application.
// You must register an application at Spotify's developer portal
// and enter this value.
const redirectURI = "http://localhost:8080/callback"

var html = `
<br/>
<a href="/player/play">Play</a><br/>
<a href="/player/pause">Pause</a><br/>
<a href="/player/next">Next track</a><br/>
<a href="/player/previous">Previous Track</a><br/>
<a href="/player/shuffle">Shuffle</a><br/>
<a href="/player/search">Search</a><br />
<a href="/player/viewqueue">View Queue</a><br />
`

var (
	auth     = spotify.NewAuthenticator(redirectURI, spotify.ScopeUserReadCurrentlyPlaying, spotify.ScopeUserReadPlaybackState, spotify.ScopeUserModifyPlaybackState)
	ch       = make(chan *spotify.Client)
	state    = "test"
	clientID = ""
	secretID = ""
	pools    = make(map[string]*websocket.Pool)
)

func player(w http.ResponseWriter, r *http.Request, client *spotify.Client) {
	action := strings.TrimPrefix(r.URL.Path, "/player/")
	fmt.Println("Got request for:", action)
	var err error
	switch action {
	case "play":
		err = client.Play()

	case "pause":
		err = client.Pause()
	case "next":
		err = client.Next()
	case "previous":
		err = client.Previous()
	case "viewqueue":
		result, err := client.PlayerCurrentlyPlaying()
		if err != nil {
			log.Fatal(err)
		}
		playListURI := result.PlaybackContext.URI
		playListURIArr := strings.Split(string(playListURI), ":")
		playListID := playListURIArr[len(playListURIArr)-1]
		//log.Println("hello" + playListURIArr[len(playListURIArr)-1])
		results, err2 := client.GetPlaylist(spotify.ID(playListID))
		///client.CreatePlaylistForUser()
		if err2 != nil {
			log.Fatal(err2)
		}
		log.Println(results.Tracks.Tracks)

	case "search":
		results, err := client.Search("holiday", spotify.SearchTypeTrack)
		if err != nil {
			log.Fatal(err)
		}
		if results.Tracks != nil {
			for _, item := range results.Tracks.Tracks {
				err = client.QueueSong(item.ID)
				if err != nil {
					log.Fatal(err)
				}
			}
		}
	}
	if err != nil {
		log.Print(err)
	}

	w.Header().Set("Content-Type", "text/html")
	fmt.Fprint(w, html)
}

func serveWs(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint Hit: WebSocket")
	conn, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
	}

	client := &websocket.Client{
		ID:   stringgen.String(10),
		Conn: conn,
		Pool: pool,
	}

	pool.Register <- client
	client.Read()
}

func setupRoutes() {
	rtr := mux.NewRouter()

	rtr.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {
		// enable CORS to allow browser to make call to API
		enableCors(&w)
		fmt.Fprintf(w, "Test Successful")
	})
	rtr.HandleFunc("/callback", completeAuth)
	rtr.HandleFunc("/getconnectionlink", func(w http.ResponseWriter, r *http.Request) {
		// enable CORS to allow browser to make call to API
		enableCors(&w)
		fmt.Fprintf(w, "nothing")
	})
	rtr.HandleFunc("/connectlobby/{id}", func(w http.ResponseWriter, r *http.Request) {
		// enable CORS to allow browser to make call to API
		enableCors(&w)

		vars := mux.Vars(r)
		varID := vars["id"]
		if pool, ok := pools[varID]; ok {
			serveWs(pool, w, r)
		} else {
			pool := websocket.NewPool(varID, clientID, secretID, auth)
			fmt.Println(clientID, secretID)
			pools[varID] = pool

			go pool.Start()

			serveWs(pool, w, r)
		}
	})

	http.Handle("/", rtr)
}

func main() {
	secretsFile, _ := ioutil.ReadFile("./secrets.json")

	secrets := secretsJSON{}

	_ = json.Unmarshal(secretsFile, &secrets)
	clientID = secrets.ClientID
	secretID = secrets.SecretID

	setupRoutes()

	http.ListenAndServe(":8080", nil)

}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func completeAuth(w http.ResponseWriter, r *http.Request) {
	// enable CORS to allow browser to make call to API
	enableCors(&w)

	for _, pool := range pools {
		tok, err := auth.Token(pool.ID, r)
		if err != nil {
			continue
		}
		st := r.FormValue("state")
		if st != pool.ID {
			http.NotFound(w, r)
			log.Fatalf("State mismatch: %s != %s\n", st, pool.ID)
		}
		// use the token to get an authenticated client
		client := auth.NewClient(tok)
		fmt.Println("Login complete")
		if err := pool.Host.Conn.WriteJSON(websocket.Message{Type: 1, Body: "connected"}); err != nil {
			fmt.Println(err)
			return
		}

		pool.SpotifyChan <- &client

	}

}
