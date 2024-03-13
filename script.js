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

            if(isOrderAccepted) alert('Your order has been Accepted!!!!');

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

