package main

import (
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/angaguard/core-backend/internal/storage"
)

func main() {
	dbPath := flag.String("db", "angaguard.db", "Path to SQLite database file")
	reset := flag.Bool("reset", false, "Remove existing database file before seeding")
	flag.Parse()

	if *reset {
		log.Printf("Resetting database at: %s", *dbPath)
		_ = os.Remove(*dbPath)
	}

	log.Printf("Initializing AngaGuard SQLite Database at: %s", *dbPath)
	store, err := storage.NewStore(*dbPath)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer store.Close()

	users, err := store.GetAllUsers()
	if err != nil {
		log.Fatalf("Failed to fetch users: %v", err)
	}

	coops, err := store.GetAllCooperatives()
	if err != nil {
		log.Fatalf("Failed to fetch cooperatives: %v", err)
	}

	farmers, err := store.GetAllFarmers()
	if err != nil {
		log.Fatalf("Failed to fetch farmers: %v", err)
	}

	kilns, err := store.GetAllKilns("")
	if err != nil {
		log.Fatalf("Failed to fetch kilns: %v", err)
	}

	smeBuyers, err := store.GetAllSMEBuyers()
	if err != nil {
		log.Fatalf("Failed to fetch SME buyers: %v", err)
	}

	txs, err := store.GetAllTransactions("")
	if err != nil {
		log.Fatalf("Failed to fetch transactions: %v", err)
	}

	fmt.Println("\n==========================================================================================")
	fmt.Printf(" [OK] AngaGuard SQLite Database Initialized & Seeded Successfully!\n")
	fmt.Println("==========================================================================================")
	fmt.Printf(" - Registered Users:       %d accounts\n", len(users))
	fmt.Printf(" - Cooperatives:           %d unions\n", len(coops))
	fmt.Printf(" - Smallholder Farmers:    %d accounts\n", len(farmers))
	fmt.Printf(" - Smart Kilns Fleet:      %d registered IoT barrels\n", len(kilns))
	fmt.Printf(" - Corporate SME Buyers:   %d active offtakers\n", len(smeBuyers))
	fmt.Printf(" - Ledger Audit Records:   %d transactions\n", len(txs))
	fmt.Println("------------------------------------------------------------------------------------------")
	fmt.Println(" Sample Seeded Users (for login & verification):")
	for i, u := range users {
		if i >= 10 {
			break
		}
		fmt.Printf("   [%02d] Role: %-12s | Name: %-26s | Phone/ID: %-15s | PIN: %s\n", i+1, u.Role, u.Name, u.Identifier, u.PIN)
	}
	fmt.Println("==========================================================================================")
}
