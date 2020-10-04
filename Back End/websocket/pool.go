package websocket

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/zmb3/spotify"
)

/**
* Pool
*  - Register: Channel for clients to register to the pool
*  - Unregister: Channel for clients to unregister from the pool
*  - Clients: A map of clients connected to the pool
*  - Broadcast: Channel for messaging all clients in pool
*  - Neighbors: Potentially useless :)
 */
type Pool struct {
	Register           chan *Client
	Unregister         chan *Client
	Clients            map[*Client]bool
	SearchSong         chan *ContentClient
	AddSong            chan *ContentClient
	Auth               spotify.Authenticator
	Host               *Client
	SpotifyChan        chan *spotify.Client
	spotifyClient      *spotify.Client
	spotifyPlayerState *spotify.PlayerState
	CurrentSong        string
	HostName           string
	ID                 string
	ClientID           string
	SecretID           string
}

/*
* NewPool
* @return a generated pool
 */
func NewPool(ID string, ClientID string, SecretID string, Auth spotify.Authenticator) *Pool {
	return &Pool{
		Register:    make(chan *Client),
		Unregister:  make(chan *Client),
		Clients:     make(map[*Client]bool),
		SearchSong:  make(chan *ContentClient),
		AddSong:     make(chan *ContentClient),
		SpotifyChan: make(chan *spotify.Client),
		Auth:        Auth,
		ID:          ID,
		ClientID:    ClientID,
		SecretID:    SecretID,
	}
}

func (pool *Pool) checkSong() {
	playing, _ := pool.spotifyClient.PlayerCurrentlyPlaying()
	name := playing.Item.Name + " - " + playing.Item.Artists[0].Name
	if name != pool.CurrentSong {
		pool.CurrentSong = name

		for client, _ := range pool.Clients {
			client.Conn.WriteJSON(Message{Type: 3, Body: name})
			client.Conn.WriteJSON(Message{Type: 4, Body: pool.HostName})
		}
	}
}

func (pool *Pool) startPolling() {
	for {
		time.Sleep(2 * time.Second)
		go pool.checkSong()
	}
}

func (pool *Pool) Start() {
	go pool.startPolling()

	for {
		select {
		case client := <-pool.Register:
			if len(pool.Clients) == 0 {
				pool.Host = client

				go func() {
					// if you didn't store your ID and secret key in the specified environment variables,
					// you can set them manually here
					pool.Auth.SetAuthInfo(pool.ClientID, pool.SecretID)

					url := pool.Auth.AuthURL(pool.ID)
					//fmt.Println("Please log in to Spotify by visiting the following page in your browser:", url)

					//pool.Host.Conn.WriteJSON(Message{Type: 0, Body: "hello"})
					fmt.Println("Writing message to client now")
					//ft.Println(url)
					if err := client.Conn.WriteJSON(Message{Type: 0, Body: url}); err != nil {
						fmt.Println(err)
						return
					}
					// wait for auth to complete
					pool.spotifyClient = <-pool.SpotifyChan

					// use the client to make calls that require authorization
					user, err := pool.spotifyClient.CurrentUser()
					if err != nil {
						log.Fatal(err)
					}
					fmt.Println("You are logged in as:", user.ID)
					pool.HostName = user.ID
					pool.spotifyPlayerState, err = pool.spotifyClient.PlayerState()
					if err != nil {
						log.Fatal(err)
					}
					fmt.Printf("Found your %s (%s)\n", pool.spotifyPlayerState.Device.Type, pool.spotifyPlayerState.Device.Name)

				}()

			}
			client.Conn.WriteJSON(Message{Type: 3, Body: pool.CurrentSong})
			client.Conn.WriteJSON(Message{Type: 4, Body: pool.HostName})

			pool.Clients[client] = true

			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			fmt.Println("Pool ID:", pool.ID)
			break
		case client := <-pool.Unregister:
			if client == pool.Host {
				log.Println("Host unregister")

				for client := range pool.Clients {
					client.Conn.WriteJSON(Message{Type: 1, Body: "Session Ended"})
					delete(pool.Clients, client)
				}
			} else {
				delete(pool.Clients, client)
				fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			}
			break
		case message := <-pool.AddSong:
			fmt.Println("Adding Song")
			fmt.Println(message.Content.SongID)
			err := pool.spotifyClient.QueueSong(spotify.ID(message.Content.SongID))
			if err != nil {
				log.Fatal(err)
			}
			break
		case message := <-pool.SearchSong:
			fmt.Println("Searching song")
			results, err := pool.spotifyClient.Search(message.Content.Song, spotify.SearchTypeTrack)
			if err != nil {
				log.Fatal(err)
			}
			songs := make([]*Song, 0)
			if results.Tracks != nil {
				for _, item := range results.Tracks.Tracks {
					song := &Song{}
					song.Album = item.Album.Name
					song.Artist = item.Artists[0].Name
					song.ID = item.ID.String()
					song.Name = item.Name
					songs = append(songs, song)
				}
			}
			out, err := json.Marshal(songs)
			if err != nil {
				panic(err)
			}
			message.Client.Conn.WriteJSON(Message{Type: 2, Body: string(out)})
		}

	}
}
