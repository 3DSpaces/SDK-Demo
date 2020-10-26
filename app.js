const apikey = '9dc7beee87a743418f760affac068cd6'
const sdkver = '3.5'
const printertag = 'XkgoKw1oFfa'

const scene1ani = '-360, 0, { speed: 36 }'

let printsfx
let touraudio
let mpSdk
let tourdata
let transinhibit = true



function ready() {


console.log("Running Ready")
let userinput = document.getElementById("userinput")
let iframe = document.getElementById("showcase_iframe");
printsfx = new Howl({
  src: ['printer.mp3']
});
iframe.addEventListener('load', showcaseLoader, true);

function showcaseLoader() {
  try {
    window.MP_SDK.connect(
      iframe, // Obtained earlier
      apikey, // Your API key
      sdkver // SDK version you are using
      // Use the latest version you can for your app
      )
      .then(connected)
      .catch();
  }
  catch (e) {
    console.error(e);
  }
};

// Gets user input and runs Step() based on it.
}

function connected(response) {
  mpSdk = response

  console.log("SDK Connected...")

  mpSdk.App.state.subscribe(function (appState) {
   // app state has changed
   console.log('The current application: ', appState.application);
   console.log('The current phase: ', appState.phase);
   console.log('Loaded at time ', appState.phaseTimes[mpSdk.App.Phase.LOADING]);
   console.log('Started at time ', appState.phaseTimes[mpSdk.App.Phase.STARTING]);
  });
  tagListen()
  tour()

}


//Returns Tour Data

function tour(){
  mpSdk.Tour.getData()
    .then(function(tour) {
      // Tour getData complete.
      if(tour.length > 0){
        tourdata = tour
        console.log("Got Tour Data...")
        listTours(tourdata)
            }
    })
    .catch(function(error) {
      // Tour getData error.
    });
}

// Steps forward in the tour

function tourNext(){
  mpSdk.Tour.next()
  .then(function() {
    // Tour next complete.
  })
  .catch(function(error) {
    // Tour next error.
  });
}

//Steps to a specfic step

function step(y){
  if (transinhibit) {
    console.log("Step already running... wait...")
  }
  else {
    transinhibit = true
    toggleButtons()
    console.log("transinhibit = " + transinhibit)
    const myStep = y;
    mpSdk.Tour.step(myStep)
    .then(function() {
      console.log("tranisition to: " + y + " complete")
      let player = document.getElementById("player" + y)
      player.play()
      player.style.visibility = 'visible'
      mpSdk.Camera.rotate(-180, 0, { speed: 18 })
          .then(function() {
          console.log("Cam move complete")
          transinhibit = false
          toggleButtons()
          console.log("transinhibit = " + transinhibit)

        })
    })
    .catch(function(error) {
      // Tour step error.
    });
  }


}


function buttonClicked(){
  console.log("The button was clicked")
  let togoto = parseInt(userinput.value)
  console.log("Jumping to..." + togoto)
  step(togoto)
  touraudio.play()
}

function tagListen(){
  mpSdk.on(mpSdk.Mattertag.Event.HOVER, function(sid, booly){
    console.log(sid + " is hovering " + booly)
  })
  mpSdk.on(mpSdk.Mattertag.Event.CLICK, function(sid){
    console.log(sid + " was clicked.")
    if (sid === printertag){
      printsfx.play()
    }
    else {
      console.log("not my tag")
    }
  })
  mpSdk.on(mpSdk.App.Event.PHASE_CHANGE, function(){
    console.log("Loose Inhibit")
    transinhibit = false
    toggleButtons()
  })
}

function listTours(data){
  data.forEach((item, i) => {

// Create the outer div with a 'swiper-slide' class for swiper
    let outerdiv = document.createElement('div')
    outerdiv.setAttribute('class', 'swiper-slide');
// Create the inner div which contains the card
    let div = document.createElement('div');
    div.setAttribute('class', 'container');
// Adds the snapshot image provided from mpSdk
    let img = document.createElement('IMG')
    img.src = item.thumbnailUrl
    img.setAttribute('class', 'snap-img')
    div.appendChild(img)
// Adds the name provided from mpSdk
    let name = document.createElement('h3')
    name.setAttribute('class', 'name')
    name.innerHTML = item.name
    div.appendChild(name)
// Adds a Player
    let sound      = document.createElement('audio');
    sound.id       = 'player'+i;
    sound.controls = 'controls';
    sound.controlsList = 'nodownload'
    sound.src      = `${i}.mp3`;
    sound.type     = 'audio/mpeg';
    sound.setAttribute('class', 'player')
    div.appendChild(sound);
// Add on an event listener for the Player
    sound.onplaying = function(){
      let player = sound.id
      console.log(sound.id + " has started!")
      step(i)
    }

// Adds the button to card
    let button = document.createElement('button')
    button.setAttribute('class', 'btn')
    button.innerHTML = "Play"
    button.setAttribute('onclick', 'step('+i+')')
    div.appendChild(button)

// Hide the button
    button.style.display = 'none'

// Adds the card to the outer div
    outerdiv.appendChild(div)
// Adds the outer div to the Swiper Carrosle
    document.getElementById("Caro").appendChild(outerdiv);

    console.log("adding element " + i)
});
// Once all of the elements are retrived from mpSdk, init Swiper
initSwiper()
}



function initSwiper(){
  let mySwiper = new Swiper('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    // loop: true,
    centeredSlides: true,
    centeredSlidesBounds: true,
    hideOnClick: true,
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },
    keyboard: {
    enabled: true,
    onlyInViewport: false,
  },
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // And if we need scrollbar
    // scrollbar: {
    //   el: '.swiper-scrollbar',
    // },
})}

// Function that toggles the visability of the toggleButtons

function toggleButtons(){
  let target = document.getElementsByClassName('btn')
  if (target[0].style.display === 'none'){
    for (let i = 0; i < target.length; i ++) {
        target[i].style.display = 'block';
  }}
  else {
    for (let i = 0; i < target.length; i ++) {
        target[i].style.display = 'none';
    }

  }

}




// Test Functions - Remove before production

function stopper(playernumb){
  let player = document.getElementById(playernumb)
  console.log(player)
  player.pause()
}

function showPlayer(){
  let target = document.getElementById('player1')
  target.style.visibility = 'visible'
}

function growIframe(){
  let target = document.getElementById('showcase_iframe')
  target.style.height = '100%'
}

function noSwipe(){
  Swiper.noSwiping
}
