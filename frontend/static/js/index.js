async function callClick() {
    const coins_counter = document.getElementById('data')
    let coins = parseInt(coins_counter.innerText)
    const click_power = document.getElementById('click_power').innerText
    coins += parseInt(click_power)
    document.getElementById("data").innerHTML = coins
    setBoostsAvailability()
}

async function getUser(id) {
    let response = await fetch('/users/' + id, {method: 'GET'});
    let answer = await response.json();
    document.getElementById("user").innerHTML = answer['username'];
    let getCycle = await fetch('/cycles/' + answer['cycle'], {
        method: 'GET'
    });
    let cycle = await getCycle.json();
    document.getElementById("data").innerHTML = cycle['coins_count'];
    document.getElementById("click_power").innerHTML = cycle['click_power'];
    document.getElementById("auto_click_power").innerHTML = cycle['auto_click_power'];
    let boost_request = await fetch('/boosts/' + answer.cycle, {
        method: 'GET'
    })
    let boosts = await boost_request.json()
    renderAllBoosts(boosts)
    setBoostsAvailability()
    setAutoClick()
    setSendCoinsInterval()
}


function buyBoost(boost_level) {
    const token = getCookie('csrftoken')
    saveCoins().then(_ => {
        fetch('/buy_boost/', {
            method: 'POST',
            headers: {
                "X-CSRFToken": token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                boost_level: boost_level
            })
        }).then(response => {
            if (response.ok) {
                return response.json()
            } else {
                return Promise.reject(response)
            }
        }).then(data => {
            document.getElementById("data").innerHTML = data['coins_count'];
            document.getElementById("click_power").innerHTML = data['click_power'];
            document.getElementById("auto_click_power").innerHTML = data['auto_click_power'];
            let boost = document.getElementById(`boost-holder-${data['level']}`);
            boost.querySelector("#boostPower").innerHTML = data['power'];
            boost.querySelector("#boostLevel").innerHTML = data['level'];
            boost.querySelector("#boostPrice").innerHTML = data['price'];
            setBoostsAvailability()
        })
    })
}


function renderAllBoosts(boosts) {
    let parent = document.getElementById('boost-wrapper')
    parent.innerHTML = ''
    boosts.forEach(boost => {
        renderBoost(parent, boost)
    })
}


function renderBoost(parent, boost) {
    const div = document.createElement('div')
    div.setAttribute('class', 'boost-holder')
    div.setAttribute('id', `boost-holder-${boost.level}`)
    div.setAttribute('onclick', `buyBoost(${boost.level})`)
    let imageSource = "/static/images/"
    if (boost.boost_type === 0) {
        div.classList.add('auto-click')
        imageSource += "flower.png"
    } else
        imageSource += 'nyancat.png'

    div.innerHTML = `
    <input id="buy" type="image" class="kitty boost" src=${imageSource} alt="boost"/>
    <p> Level:<br> <span id="boostLevel"> ${boost.level} </span> </p>
    <p> Power:<br> <span id="boostPower"> ${boost.power} </span></p>
    <p> Price:<br> <span id="boostPrice"> ${boost.price} </span></p>
  `
    parent.appendChild(div)
}


function setBoostsAvailability() {
    const counter = document.getElementById('data')
    const boosts = document.getElementsByClassName('boost-holder')

    for (let boost of boosts) {
        setBoostAvailability(counter.innerHTML, boost)
    }
}


function setBoostAvailability(coins, boost) {
    const price = boost.querySelector("#boostPrice").innerHTML
    if (parseInt(price) > parseInt(coins)) {
        boost.setAttribute('disabled', 'true')
        boost.style.pointerEvents = 'none';
    } else {
        boost.removeAttribute('disabled')
        boost.style.pointerEvents = 'auto';
    }
}


function setAutoClick() {
    setInterval(function () {
        const coins_counter = document.getElementById('data')
        let coins_value = parseInt(coins_counter.innerText)

        const auto_click_power = document.getElementById('auto_click_power').innerText
        coins_value += parseInt(auto_click_power)
        document.getElementById("data").innerHTML = coins_value;
    }, 1000)
}


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function setSendCoinsInterval() {
    setInterval(function () {
        saveCoins().then(_ => {
        })
    }, 10000)
}


function saveCoins() {
    const token = getCookie('csrftoken')
    const coins_counter = document.getElementById('data').innerText
    return fetch('/save_main_cycle/', {
        method: 'POST',
        headers: {
            "X-CSRFToken": token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            coins_count: coins_counter,
        })
    }).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            return Promise.reject(response)
        }
    }).then(data => {
        if (data.boosts)
            renderAllBoosts(data.boosts)
        setBoostsAvailability()
    }).catch(err => console.log(err))
}