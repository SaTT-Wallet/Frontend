importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

var trans = {};


fetch("./assets/i18n/en.json").then(function(res) {
    return res.json();
}).then(function(data) {
    trans = data;
});

  
firebase.initializeApp({  
    apiKey: "AIzaSyAHfBKuneC6G0Uu9RKwI9hZKOjNiPQRd1U",
      authDomain: "satt-token.firebaseapp.com",
      databaseURL: 'https://satt-token.firebaseio.com',
      projectId: "satt-token",
      storageBucket: "satt-token.appspot.com",
      messagingSenderId: "284190209745",
      appId: "1:284190209745:web:dc01085f6a6dabfcc837f0",
      measurementId: "G-DSJK01CZ0X"
});
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
/* eslint-disable */
let messaging = firebase.messaging();//@eslint-disable-line

/* eslint-disable */


// onBackgroundMessage
try {
    if (firebase.messaging.isSupported()) {
        const messaging = firebase.messaging();

    }
} catch (e) {}

messaging.onBackgroundMessage((payload) => {

    // Customize notification here
    let notificationTitle = "SaTT";
    let notificationOptions = {
        body: eval('trans.' + siwtchFunction(obj).type),
        icon: "./assets/Images/tet.png",
        //  icon: "https://www.gstatic.com/devrel-devsite/prod/ve25c3e040096d9860a1b86503ff88692bbcb336f8204869702074147185c6987/firebase/images/lockup.png"

    };
    const promiseChain = clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        })
        .then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                windowClient.postMessage(payload);

            }

        })
        .then(() => {

            //return registration.showNotification('my notification title');

        });
    let myUrl = "https://satt.atayen.us/#/home"; // used for production environment

    // let myUrl= "http://localhost:4200/#/home";  // used for local environment
    self.addEventListener('notificationclick', function(event) {
        event.waitUntil(self.clients.openWindow(myUrl));
        event.notification.close();
    });


    return self.registration.showNotification(notificationTitle, notificationOptions);

    //return promiseChain;

});


function siwtchFunction(item) {
    // if (localStorage.getItem("local") == "en") {
    //   item.createdFormated = moment
    //     .parseZone(item.created)
    //     .format(" MMMM Do YYYY, h:mm a");
    //   item.created = moment.parseZone(item.created).fromNow().slice();
    // } else if (localStorage.getItem("local") == "fr") {
    //   item.createdFormated = moment
    //     .parseZone(item.created)
    //     .locale("fr")
    //     .format(" Do MMMM  YYYY, HH:mm ");
    //   item.created = moment.parseZone(item.created).locale("fr").fromNow();

    // }
    item._label = item.label;
    const receive_satt_pic = "./assets/Images/notifIcons/Reception.svg";
    switch (item.type) {
        case "send_demande_satt_event":
            item._params = {
                nbr: item._label["price"],
                crypto: item._label["currency"],
                name: item._label["name"],
            };
            item._label = "asked_to_acquire";
            item.img = receive_satt_pic;
            break;
            //////////////////////////////////////////
        case "demande_satt_event":

            item._params = {
                nbr: item._label["price"],
                crypto: item._label["currency"],
                name: item._label["name"],
            };
            item._label = "asked_cryptoCurrency";
            item.img = receive_satt_pic;
            break;
            //////////////////////////////////////////
        case "save_legal_file_event":
            if (item._label["type"] == "proofDomicile") {
                item._label = "confirm_legal_kyc_proof";
            } else {
                item._label = "confirm_legal_kyc_identity";
            }
            item.img = "./assets/Images/notifIcons/CandidValid.svg";
            break;
            //////////////////////////////////////////
        case "validated_link":
            item._params = {
                name: item._label["cmp_name"],
                link: item._label["cmp_link"],
                hash: item._label["cmp_hash"],
            };
            item._label = "campaign_notification.candidate_accept_link";
            item.img = "./assets/Images/notifIcons/lienAccepte.svg";
            break;
            //////////////////////////////////////////

            // case "transfer_event":
            //   if (item._label["currency"]) {

            //     item._label = "transfer_event_currency";
            //   } else if (item._label["network"]) {

            //     item._label = "transfer_event_network";
            //   }
            //   item.img = "./assets/Images/notifIcons/envoi.svg";
            //   break;

        case 'transfer_event':
            if (item._label['currency']) {
                let decimal = item._label['decimal'] ?
                    new Big('10').pow(item._label['decimal']) :
                    ListTokens[item._label.currency].decimals;

                item._params = {
                    currency: item._label['currency'],
                    nbr: Big(item._label['amount']).div(decimal),
                    //  currency: item._label["currency"],
                    to: item._label['to']
                };
                item._label = 'transfer_event_currency_firebase';
            } else if (item._label['network']) {
                item._params = {
                    nbr: Big(item._label['amount']).div(etherInWei),
                    network: item._label['network'],
                    to: item._label['to']
                };
                item._label = 'transfer_event_network';
            }
            item.img = './assets/Images/notifIcons/envoi.svg';
            break;
            //////////////////////////////////////////

            // case "receive_transfer_event":
            //     if (item._label["currency"]) {

            //         item._label = "receive_transfer_event_currency";
            //     } else if (item._label["network"]) {

            //         item._label = "receive_transfer_event_network";
            //     }
            //     item.img = "./assets/Images/notifIcons/Reception.svg";
            //     break;

        case 'receive_transfer_event':
            if (item._label['currency']) {
                let decimal = item._label['decimal'] ?
                    new Big('10').pow(item._label['decimal']) :
                    ListTokens[item._label.currency].decimals;

                item._params = {
                    nbr: Big(item._label['amount']).div(decimal),
                    currency: item._label['currency'],
                    from: item._label['from']
                };
                item._label = 'receive_transfer_event_currency';
            } else if (item._label['network']) {
                item._params = {
                    nbr: Big(item._label['amount']).div(etherInWei),
                    network: item._label['network'],
                    from: item._label['from']
                };
                item._label = 'receive_transfer_event_network';
            }
            item.img = './assets/Images/notifIcons/Reception.svg';
            break;
            //////////////////////////////////////////
        case "convert_event":

            item._label = item._label["Direction"] == "ETB" ? "convert_event_ETB" : "convert_event_BTE";
            item.img = "./assets/Images/notifIcons/CandidValid.svg";
            break;

            //////////////////////////////////////////
        case "apply_campaign":
            item._params = {
                title: item._label["cmp_name"],
                owner: item._label["cmp_owner"],
            };
            item._label = "apply_campaign";
            item.img = "./assets/Images/notifIcons/CandidValid.svg";
            break;
        case "rejected_link":
            item._params = {
                name: item._label["cmp_name"],
                link: item._label["cmp_link"],
                hash: item._label["cmp_hash"],
            };
            item._label = "campaign_notification.candidate_reject_link";
            item.img = "./assets/Images/notifIcons/lienRefuse.svg";
            break;
            //////////////////////////////////////////
        case "cmp_candidate_accept_link":
            item._params = {
                name: item._label["cmp_name"],
                link: item._label["cmp_link"],
                hash: item._label["cmp_hash"],
            };
            item._label = "campaign_notification.candidate_accept_link";
            item.img = "./assets/Images/notifIcons/lienAccepte.svg";
            break;
            //////////////////////////////////////////
        case "cmp_candidate_reject_link":
            item._params = {
                name: item._label["cmp_name"],
                link: item._label["cmp_link"],
                hash: item._label["cmp_hash"],
            };
            item._label = "campaign_notification.candidate_reject_link";
            item.img = "./assets/Images/notifIcons/lienRefuse.svg";
            break;

            //////////////////////////////////////////
        case "cmp_candidate_insert_link":
            item._params = {
                name: item._label["cmp_name"],
                hash: item._label["cmp_hash"],
            };
            item._label = "campaign_notification.candidate_insert_link";
            item.img = "./assets/Images/notifIcons/ajoutLien.svg";
            break;
            //////////////////////////////////////////
        case "cmp_candidate_accepted":
            item._params = {
                name: item._label["cmp_name"],
                hash: item._label["cmp_hash"],
            };
            item._label = "campaign_notification.candidate_insert_link";
            item.img = "./assets/Images/notifIcons/lienAccepte.svg";
            break;
            //////////////////////////////////////////
        case "cmp_candidate_rejected":
            item._params = {
                name: item._label["cmp_name"],
                editorCmpUrl: walletUrl + "campaigns",
            };
            item._label = "campaign_notification.editor_cmp_rejected";
            item.img = "./assets/Images/notifIcons/lienRefuse.svg";
            break;
            //////////////////////////////////////////
        case "validate_kyc":
            if (item._label["action"] == "validated kyc") {
                item._label = "kyc_validation_cofirm";
            }
            item.img = "./assets/Images/notifIcons/CandidValid.svg";
            break;

            ////////////////old ones//////////////////////////
        case "save_buy_satt_event":
            item._params = {
                amount: item._label["amount"],
                quantity: item._label["quantity"],
            };
            item._label = "buy_satt_notify";
            item.img = receive_satt_pic;
            break;
            //////////////////////////////////////////
        case "transfer_satt_event":
            item._params = {
                nbr: item._label["amount"],
                crypto: item._label["currency"],
                email: item._label[2],
            };
            item._label = "transfer_money";
            item.img = "./assets/Images/notifIcons/envoi.svg";
            break;
            //////////////////////////////////////////
        case "received_satt_event":
            item._params = {
                nbr: item._label["amount"],
                crypto: item._label["currency"],
                email: item._label[2],
            };
            item._label = "received_satt";
            item.img = receive_satt_pic;
            break;
            //////////////////////////////////////////
        case "add_contact_event":
            item._params = { nbr: item._label[0] };
            item._label = "contact_satt";
            item.img = "./assets/Images/notifIcons/userImg.svg";
            break;
            //////////////////////////////////////////
        case "add_contact_fb_event":
            item._label = item._label[0];
            item.img = "./assets/Images/notifIcons/userImg.svg";
            break;
            //////////////////////////////////////////
        case "affiliation_contact_event":
            item._label = "link_sent";
            item.img = "./assets/Images/notifIcons/ajoutLien.svg";
            break;
            //////////////////////////////////////////
        case "contact_satt_event":
            item._params = { email: item._label[0] };
            item._label = "contact_satt_list";
            item.img = "./assets/Images/notifIcons/userImg.svg";
            break;
            //////////////////////////////////////////
        case "import_event":
            item._params = { nbr: item._label[2], file: item._label[1] };
            item._label = "contact_satt_import";
            item.img = "./assets/Images/notifContact.svg";
            break;
            //////////////////////////////////////////
        case "send_mail_event":
            item._params = { email: item._label[0] };
            item._label = "email_has_been_sent";
            item.img = "./assets/Images/notifIcons/envoi.svg";
            break;
            //////////////////////////////////////////
        case "buy_satt_event":
            item._params = {
                amount: item._label["amount"],
                quantity: item._label["quantity"],
            };
            item._label = "buy_satt_notify";
            item.img = receive_satt_pic;
            break;

            //////////////////////////////////////////
    }

    // console.log( useState(localStorage.getItem('token')))
    // console.log( localStorage.getItem(key))

    return item;
}
