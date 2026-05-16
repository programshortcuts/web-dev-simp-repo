function getWeather() {
    return new Promise(function (resolve, reject) {
        console.log('...waiting')
        setTimeout(() => {
            resolve('Cloudy')
        }, 90)
    })
}
function weatherSymbols(weather) {
    if (weather == 'Cloudy') {
        console.log('☁️')
    }
}
getWeather().then(weatherSymbols)

