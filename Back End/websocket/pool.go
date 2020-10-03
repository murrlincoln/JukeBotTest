package websocket

import (
	"fmt"
	"log"

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
	AddSong            chan Message
	Host               *Client
	spotifyClient      *spotify.Client
	spotifyPlayerState *spotify.PlayerState
	ID                 string
}

/*
* NewPool
* @return a generated pool
 */
func NewPool(ID string) *Pool {
	return &Pool{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		AddSong:    make(chan Message),
		ID:         ID,
	}
}

func (pool *Pool) Start() {
	for {
		select {
		case client := <-pool.Register:
			if len(pool.Clients) == 0 {
				pool.Host = client
			}
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
			//fmt.Println("The message is: ", message)
			fmt.Println("Sending message to all clients in Pool")
			for client := range pool.Clients {
				if err := client.Conn.WriteJSON(message); err != nil {
					fmt.Println(err)
					return
				}
			}
		}

	}
}
