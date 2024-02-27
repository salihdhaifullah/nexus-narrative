package image_processor

import (
	"bytes"
	"fmt"
	"image"
	"image/color"
	"image/draw"
	"log"
	"math/rand"
	"time"

	"github.com/nickalie/go-webpbin"
	"github.com/salihdhaifullah/nexus-narrative/helpers"
)

const (
	GridSize     = 10
	CellSize     = 80
	ImageSize    = 800
	ShapeDensity = 1
)

var random = rand.New(rand.NewSource(time.Now().UnixNano()))

func CreateAvatar() string {

	img := image.NewRGBA(image.Rect(0, 0, ImageSize, ImageSize))

	backgroundColor := getRandomColor()
	draw.Draw(img, img.Bounds(), &image.Uniform{backgroundColor}, image.Point{}, draw.Src)

	pattern := generateSymmetricPattern(GridSize)
	shapeColor := getRandomColor()

	for x := 0; x < len(pattern); x++ {
		for y := 0; y < len(pattern[x]); y++ {
			if pattern[x][y] {
				drawRandomRectangle(img, shapeColor, y*CellSize, x*CellSize, CellSize, CellSize)
			}
		}
	}

	buf := bytes.Buffer{}
	err := webpbin.Encode(&buf, img)
	if err != nil {
		log.Fatal(err)
	}

	url := helpers.UploadFile(buf.Bytes(), fmt.Sprintf("%d.webp", time.Now().Unix()))

	return url
}

func getRandomColor() color.RGBA {
	return color.RGBA{uint8(random.Intn(256)), uint8(random.Intn(256)), uint8(random.Intn(256)), 255}
}

func drawRandomRectangle(img *image.RGBA, shapeColor color.RGBA, x, y, width, height int) {
	rect := image.Rect(x, y, x+width, y+height)
	draw.Draw(img, rect, &image.Uniform{shapeColor}, image.Point{}, draw.Src)
}

func generateSymmetricPattern(length int) [][]bool {
	random.Seed(time.Now().UnixNano())

	var patterns [][]bool

	for i := 0; i < length; i++ {
		leftSide := make([]bool, length/2)
		for j := 0; j < length/2; j++ {
			leftSide[j] = []bool{false, true}[random.Intn(2)]
		}

		rightSide := make([]bool, length/2)

		copy(rightSide, leftSide)

		for j := range leftSide {
			rightSide[length/2-1-j] = leftSide[j]
		}

		row := leftSide
		row = append(row, rightSide...)

		patterns = append(patterns, row)
	}

	return patterns
}
