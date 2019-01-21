<?php

include('theme-config.php');
require 'vendor/autoload.php';
use net\authorize\api\contract\v1 as AnetAPI;
use net\authorize\api\controller as AnetController;
define("AUTHORIZENET_LOG_FILE", "phplog");


function loadDeps() {
  wp_enqueue_style('mainstyles', get_template_directory_uri() . "/style.css", array(), microtime(true));
  wp_enqueue_script('mainscripts', get_template_directory_uri() . "/bundle.js", array(), microtime(true));
}

function getProducts($query) {
  $status = $query['status'];
  $page = $query['page'];
  $eforoUrl = 'https://onlineposting.e-foro.com/items_api/get_items';
  $options = array(
    'headers' => array(
      'User-Agent' => 'allpawn-autobot-optimus-prime',
      'X-Authorization' => 'TOKEN ' . PRODUCTS_API_TOKEN
    )
  );
  $response = wp_remote_get($eforoUrl . '?status=' . $status . '&page=' . $page, $options);

  if (is_array($response) && ! is_wp_error($response)) {
    $headers = $response['headers']; // array of http header lines
    $body    = $response['body']; // use the content
  }

  return $body;
}

add_action('rest_api_init', function() {
  register_rest_route('allpawn/v1', '/products', array(
    'methods' => 'GET',
    'callback' => 'getProducts',
  ));
  register_rest_route('allpawn/v1', '/purchase-product', array(
    'methods' => 'POST',
    'callback' => 'purchaseProduct',
  ));
  register_rest_route('allpawn/v1', '/checkout', array(
    'methods' => 'POST',
    'callback' => 'checkout',
  ));
});

function checkout($query) {
  /* cart, card, formData */
  $propList = preg_split ("/\,/", $query['propList']);
  foreach ($propList as $prop) {
    $data[$prop] = $query[$prop];
  }

  chargeCreditCard($data['cart'], $data['card'], $data['formData']);

  return $data;
}

function purchaseProduct($query) {
  /* customer, product */
  $propList = preg_split ("/\,/", $query['propList']);
  foreach ($propList as $prop) {
    $data[$prop] = $query[$prop];
  }

  $reqBody = array(
    'external_id' => $data['product']['external_id'],
    'inventory_id' => $data['product']['inventory_id'],
    'sold_price' => $data['product']['value'],
    'payment_type' => 'CREDIT',
    'quantity' => 1,
    'buyer' => $data['customer'],
  );

  $eforoUrl = 'https://onlineposting.e-foro.com/items_api/create_item_sale';
  $options = array(
    'body' => json_encode($reqBody),
    'headers' => array(
      'User-Agent' => 'allpawn-autobot-optimus-prime',
      'X-Authorization' => 'TOKEN ' . PRODUCTS_API_TOKEN
    ),
    'json' => true,
  );
  $response = wp_remote_post($eforoUrl, $options);

  if (is_array($response) && ! is_wp_error($response)) {
    $headers = $response['headers']; // array of http header lines
    $body    = $response['body']; // use the content
  }

  return $response;
}

add_action('wp_enqueue_scripts', 'loadDeps');

/*
import { Meteor } from 'meteor/meteor';
import rp from 'request-promise';

const { PRODUCTS_API_TOKEN } = Meteor.settings;

export default function markEforoProdctAsSold(product, buyer) {
  const { external_id } = product;
  const sold_price = product.value;
  const payment_type = 'CREDIT';
  const quantity = 1;
  console.log(product, buyer);
  const options = {
    uri: ,
    body: {
      external_id,

      sold_price,
      payment_type,
      quantity,
      buyer,
    },
    headers: {
      'User-Agent': 'allpawn-autobot-optimus-prime',
      'X-Authorization': `TOKEN ${PRODUCTS_API_TOKEN}`,
    },
    json: true,
  };

  console.log(options.body);
  return new Promise((resolve, reject) => {
    rp(options)
      .then((results) => {
        resolve(results);
      }).catch(err => reject(err));
  });
}

/* Copied from the authorize.net sandbox boilerplate
 *
 */

function chargeCreditCard($cart, $card, $formData) {
  $merchantAuthentication = new AnetAPI\MerchantAuthenticationType();
  $merchantAuthentication->setName(CC_AUTH_LOGIN);
  $merchantAuthentication->setTransactionKey(CC_AUTH_TRANSACTION_KEY);


  // Set the transaction's refId
  $refId = 'ref' . time();

  // Create the payment data for a credit card
  $creditCard = new AnetAPI\CreditCardType();
  $creditCard->setCardNumber($card['cardNumber']);
  $creditCard->setExpirationDate($card['expirationDate']);
  $creditCard->setCardCode($card['cardCode']);

  // Add the payment data to a paymentType object
  $paymentOne = new AnetAPI\PaymentType();
  $paymentOne->setCreditCard($creditCard);

  // Create order information
  $order = new AnetAPI\OrderType();
  $order->setInvoiceNumber(uniqid());
  $order->setDescription("Allpawn / Katguitars Online Transaction");

  $billTo = new AnetAPI\CustomerAddressType();
  $billTo->setFirstName($formData['bfirstName']);
  $billTo->setLastName($formData['blastName']);
  $billTo->setCompany($formData['bcompany']);
  $billTo->setAddress($formData['baddress']);
  $billTo->setCity($formData['bcity']);
  $billTo->setState($formData['bstate']);
  $billTo->setZip($formData['bzip']);
  $billTo->setCountry($formData['bcountry']);

  // Set the customer's Bill To address
  $shipTo = new AnetAPI\CustomerAddressType();
  $shipTo->setFirstName($formData['sfirstName']);
  $shipTo->setLastName($formData['slastName']);
  $shipTo->setCompany($formData['scompany']);
  $shipTo->setAddress($formData['saddress']);
  $shipTo->setCity($formData['scity']);
  $shipTo->setState($formData['sstate']);
  $shipTo->setZip($formData['szip']);
  $shipTo->setCountry($formData['scountry']);

  // Set the customer's identifying information
  $customerData = new AnetAPI\CustomerDataType();
  $customerData->setType("individual");
  $customerData->setId(uniqid());
  $customerData->setEmail($formData['email']);

  $total = 0;

  foreach($cart as $prod) {
    $total += floatval($prod['value']);
  }

  $items = array_map(function($product) {
    $lineItem = new AnetAPI\LineItemType();
    $lineItem->setItemId($product['characteristics']['sku']);
    $lineItem->setName($product['characteristics']['model']);
    $lineItem->setDescription('');
    $lineItem->setQuantity('1');
    $lineItem->setUnitPrice(floatval($product['value']));
    return $lineItem;
  }, $cart);

  // Create a TransactionRequestType object and add the previous objects to it
  $transactionRequestType = new AnetAPI\TransactionRequestType();
  $transactionRequestType->setTransactionType("authCaptureTransaction");
  $transactionRequestType->setAmount($total);
  $transactionRequestType->setOrder($order);
  $transactionRequestType->setPayment($paymentOne);
  $transactionRequestType->setBillTo($billTo);
  $transactionRequestType->setShipTo($shipTo);
  $transactionRequestType->setLineItems($items);
  $transactionRequestType->setCustomer($customerData);

  // Assemble the complete transaction request
  $request = new AnetAPI\CreateTransactionRequest();
  $request->setMerchantAuthentication($merchantAuthentication);
  $request->setRefId($refId);
  $request->setTransactionRequest($transactionRequestType);

  // Create the controller and get the response
  $controller = new AnetController\CreateTransactionController($request);
  $response = $controller->executeWithApiResponse(\net\authorize\api\constants\ANetEnvironment::PRODUCTION);

  if ($response != null) {
    // Check to see if the API request was successfully received and acted upon
    if ($response->getMessages()->getResultCode() == "Ok") {
      // Since the API request was successful, look for a transaction response
      // and parse it to display the results of authorizing the card
      $tresponse = $response->getTransactionResponse();

      if ($tresponse != null && $tresponse->getMessages() != null) {
        //echo " Successfully created transaction with Transaction ID: " . $tresponse->getTransId() . "\n";
        //echo " Transaction Response Code: " . $tresponse->getResponseCode() . "\n";
        //echo " Message Code: " . $tresponse->getMessages()[0]->getCode() . "\n";
        //echo " Auth Code: " . $tresponse->getAuthCode() . "\n";
        //echo " Description: " . $tresponse->getMessages()[0]->getDescription() . "\n";
      } else {
        echo "Transaction Failed \n";
        if ($tresponse->getErrors() != null) {
          //echo " Error Code  : " . $tresponse->getErrors()[0]->getErrorCode() . "\n";
          //echo " Error Message : " . $tresponse->getErrors()[0]->getErrorText() . "\n";
        }
      }
      // Or, print errors if the API request wasn't successful
    } else {
      //echo "Transaction Failed \n";
      $tresponse = $response->getTransactionResponse();

      if ($tresponse != null && $tresponse->getErrors() != null) {
        //echo " Error Code  : " . $tresponse->getErrors()[0]->getErrorCode() . "\n";
        //echo " Error Message : " . $tresponse->getErrors()[0]->getErrorText() . "\n";
      } else {
        //echo " Error Code  : " . $response->getMessages()->getMessage()[0]->getCode() . "\n";
        //echo " Error Message : " . $response->getMessages()->getMessage()[0]->getText() . "\n";
      }
    }
  } else {
    //echo  "No response returned \n";
  }

  return $response;
}
