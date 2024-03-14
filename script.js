let isOrderAccepted = false;
let isValetFound = false;
let hasRestaurantSeenYourOrder = false;
let restaurantTimer = null;
let valetTimer = null;
let valetDeliveryTimer = null;
let isOrderDelivered = false;

//zomato app - boot up/start/powerup
window.addEventListener('load', function () {
    document.getElementById('acceptorder').addEventListener('click', function () {
        askRestaurantAcceptOrReject();
    });

    document.getElementById('findValet').addEventListener('click', () => {
        startSearchingForValets();
    });

    document.getElementById('orderDeliver').addEventListener('click', () => {
        setTimeout(() => {
            isOrderDelivered = true;
        }, 3000);
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
        checkIfValetAssigned(),
        checkIfOrderDelivered()
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
            document.getElementById('currentStatus').innerText = isOrderDelivered ? 'Order Delivered succefully' : 'Preparing your order';
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

function checkIfValetAssigned() {
    return new Promise((resolve, reject) => {
        valetTimer = setInterval(() => {
            console.log('Searching for valet');
            if(isValetFound) {
                updateValetDetails();
                resolve('Update valet details');
                clearTimeout(valetTimer)
            }
        }, 1000);
    })
}

function checkIfOrderDelivered() {
    return new Promise((resolve, reject) => {
        valetDeliveryTimer = setInterval(() => {
            console.log('Is order delivered by valet?');
            if(isOrderDelivered) {
                resolve('Order Delivered');
                updateOrderStatus();
                clearTimeout(valetDeliveryTimer);
            }
        });
    });
}

function updateValetDetails() {
    if(isValetFound) {
        document.getElementById('finding-driver').classList.add('none');

        document.getElementById('found-driver').classList.remove('none');
        document.getElementById('call').classList.remove('none');
    }
}

