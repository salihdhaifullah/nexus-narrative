package helpers

import "sync"

func WaitFor(fn func (), wg *sync.WaitGroup) {
	fn()
	wg.Done()
}
