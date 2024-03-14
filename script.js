let isOrderAccepted = false;
let isValetFound = false;
let hasRestaurantSeenYourOrder = false;
let restaurantTimer = null;

//zomato app - boot up/start/powerup
window.addEventListener('load', function () {
    document.getElementById('acceptorder').addEventListener('click', function () {
        askRestaurantAcceptOrReject();
    });

    hasOrderAcceptedFromRestaurant()
        .then(isOrderAccepted => {
            console.log('Updated from Restaurant -',isOrderAccepted);

            if(isOrderAccepted) startPreparingOrder();

            //Step 3 - Order rejected
            else alert('Sorry, Restaurant rejected your order. Returning the total amount with zomato shares');
        })
        .catch(err => {
            console.error(err);
            alert('Something went wrong, Please try again later!!');
    });
});

//step-1 Check whether restaurant accepted order or not
function askRestaurantAcceptOrReject() {
    //callback
    setTimeout(() => {
        isOrderAccepted = confirm('Should restaurant accept order?');
        hasRestaurantSeenYourOrder = true;
    }, 1000);

}

//step-2 Check if restaurant has accepted order
function hasOrderAcceptedFromRestaurant() {
    //Promise
    return new Promise((resolve, reject) => {
        restaurantTimer = setInterval(() => {
            console.log('Checking if order accepted or not');
            if(!hasRestaurantSeenYourOrder) return;
            
            if(isOrderAccepted) resolve(true);
            else resolve(false);

            clearInterval(restaurantTimer);
        }, 2000)
    });
}

//step 4 - Start Preparing
function startPreparingOrder() {
    Promise.all ([
        updateOrderStatus(),
        updateMapView(),
        startSearchingForValets(),
        // checkForOrderDelivery()
    ])
    .then(res => {
        console.log(res);
        setTimeout(() => {
            alert('How was your food? Rate your food & delivery partner!')
        }, 5000);
    })
    .catch(err => {
        console.error(err);
    })
}

// Helper Functions - pure functions
function updateOrderStatus() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            document.getElementById('currentStatus').innerText = 'Start Preparation...';
            resolve('Status Updated');
        }, 1500);
    });
}

function updateMapView() {
    //Fake Delay
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            document.getElementById('mapview').style.opacity = '1';
            resolve('Map Intialized!');
        }, 1000);
    })
}

//Complex Operation :-
//1) Get all the locations of nearby valets
//2) Sort the valets based on shortest path of restaurant to customer's location
//3) Select the valet with shortest distance & minimum orders

function startSearchingForValets() {
    //Step 1 - Get Valet
    const valetPromises = [];
    for(let i=0; i<5; i++) {
        valetPromises.push(getRandomDriver());
    }
    console.log(valetPromises);

    Promise.any(valetPromises)
    .then(selectedValet => {
        console.log('Valet has been assigned - ', selectedValet);
        isValetFound = true;
    })
    .catch(err => {
        console.error(err);
    })
}

function getRandomDriver() {
    // Fake delay to get location data from driver
    return new Promise((resolve, reject) => {
        const timeout = Math.random() * 5000;
        setTimeout(() => {
            resolve('Valet - ' + timeout);
        }, timeout);
    });
}