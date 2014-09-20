/**
 * "soothing chantal"
 * a generative lullaby
 * by leandro estrella
 * cargocollective.com/leandroestrella
 */
 
import processing.video.*;

boolean isPlaying;

int maxMovies= 6;
int rand = int(random(maxMovies));

int oldX = 0;
int oldY = 0;

Movie[] myMovies = new Movie[maxMovies] ;

ArrayList<Movie>   moviesPlaying = new ArrayList<Movie>();

Movie firstClipMovie;

void setup() {
  size (1100, 800, P2D);
  background(0);

  firstClipMovie = new Movie(this, "lala.oggtheora.ogv");
  isPlaying = true;
  firstClipMovie.loop();

  for (int i = 0; i < myMovies.length; i ++ ) {
    myMovies[i] = new Movie(this, "lala.oggtheora.ogv");
  }
  
  moviesPlaying.add(firstClipMovie);
  tint(255, 50);
}

/*void keyPressed() {
  if (key == ENTER) {       // enter stop the main video
    firstClipMovie.stop();
  } else if (key == ' ') {  // spacebar pause the main video
    if (isPlaying) {
      firstClipMovie.pause();
    } else {
      firstClipMovie.play();
    }
    isPlaying = !isPlaying;
  }
}*/

void draw() {
  if (firstClipMovie.available()) {
    //firstClipMovie.read();
    image(firstClipMovie, 0, 0, width, height); // Draw the video onto the screen
    int brightestX = 0; // X-coordinate of the brightest video pixel
    int brightestY = 0; // Y-coordinate of the brightest video pixel
    float brightestValue = 0; // Brightness of the brightest video pixel
    // Search for the brightest pixel: For each row of pixels in the video image and
    // for each pixel in the yth row, compute each pixel's index in the video
    firstClipMovie.loadPixels();
    int index = 0;
    for (int y = 0; y < firstClipMovie.height; y++) {
      for (int x = 0; x < firstClipMovie.width; x++) {
        // Get the color stored in the pixel
        int pixelValue = firstClipMovie.pixels[index];
        // Determine the brightness of the pixel
        float pixelBrightness = brightness(pixelValue);
        // If that value is brighter than any previous, then store the
        // brightness of that pixel, as well as its (x,y) location
        if (pixelBrightness > brightestValue) {
          brightestValue = pixelBrightness;
          brightestY = y;
          brightestX = x;
        }
        index++;
      }
    }
    oldX = brightestX;
    oldY = brightestY;
  }  else if (oldX <= 200) {
    rand = int(random(maxMovies));
    moviesPlaying.add(myMovies[rand]);
    moviesPlaying.get(moviesPlaying.size()-1).loop();
  }
  for (int i = 0; i< moviesPlaying.size(); i++ ) {
    Movie m = moviesPlaying.get(i);
    if (m.available())
    m.read();
    image(m, 0, 0, width, height);

    // main video speed
    float newSpeed = map(oldX, 0, width, -0.5, 2);
    firstClipMovie.speed(newSpeed);
    
    // main video volume
    float newVolume = map(oldX+oldY, 0, width, 0, 100);
    firstClipMovie.volume(newVolume);
    
    // second+ video speed
    float newSpeedB = map(oldY, 0, height, -0.5, 2);
    myMovies[rand].speed(newSpeedB);
    
    // visualizers
    textAlign(CENTER, LEFT);
    fill(255);
    textSize(10);
    text(nfc(newSpeed, 2) + " S", 30, 20);
    text(nfc(oldY, 2) + " Y", 570, 20);
    text(nfc(newSpeedB, 2) + " S", 1070, 20);
    text(nfc(frameRate, 2) + " F", 30, 785);
    text(nfc(oldX, 2) + " X", 570, 785);
    text(nfc(newVolume, 2) + " V", 1070, 785);
  }
}
