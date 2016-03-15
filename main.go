package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

// handler for the main page
func HomeHandler(response http.ResponseWriter, request *http.Request) {
	response.Header().Set("Content-type", "text/html")
	webpage, err := ioutil.ReadFile("index.html")

	if err != nil {
		http.Error(response, fmt.Sprintf("index.html file error %v", err), 500)
	}

	fmt.Fprint(response, string(webpage))
}

func main() {
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("js/"))))
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("css/"))))
	http.HandleFunc("/", HomeHandler)
	http.ListenAndServe(":8080", nil)
}
