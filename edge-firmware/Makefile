CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -O2 -Iinclude

all: bin/firmware bin/simulator

bin/firmware: src/main.cpp include/*.h
	@mkdir -p bin
	$(CXX) $(CXXFLAGS) -o bin/firmware src/main.cpp

bin/simulator: simulator.cpp include/*.h
	@mkdir -p bin
	$(CXX) $(CXXFLAGS) -o bin/simulator simulator.cpp

test: all
	@echo "Running C++ Firmware & Simulator tests..."
	./bin/firmware
	@echo "--- Valid Payload ---"
	./bin/simulator valid
	@echo "--- Ash Cheating Attack Payload ---"
	./bin/simulator ash_cheating
	@echo "--- Sand Padding Attack Payload ---"
	./bin/simulator sand_padding

clean:
	rm -rf bin
