<?php

namespace App\Services;

use GuzzleHttp\Client;

class PayPalService
{
    protected $client;
    protected $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('paypal.mode') === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';

        $this->client = new Client();
    }

    private function getAccessToken()
    {
        $response = $this->client->post("{$this->baseUrl}/v1/oauth2/token", [
            'auth' => [config('paypal.client_id'), config('paypal.secret')],
            'form_params' => ['grant_type' => 'client_credentials']
        ]);
        return json_decode($response->getBody())->access_token;
    }

    public function createOrder($amount)
    {
        $accessToken = $this->getAccessToken();
        $response = $this->client->post("{$this->baseUrl}/v2/checkout/orders", [
            'headers' => [
                'Authorization' => "Bearer $accessToken",
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'intent' => 'CAPTURE',
                'purchase_units' => [[
                    'amount' => [
                        'currency_code' => 'USD',
                        'value' => $amount
                    ]
                ]]
            ]
        ]);
        return json_decode($response->getBody(), true);
    }

    public function captureOrder($orderId)
    {
        $accessToken = $this->getAccessToken();
        $response = $this->client->post("{$this->baseUrl}/v2/checkout/orders/{$orderId}/capture", [
            'headers' => [
                'Authorization' => "Bearer $accessToken",
                'Content-Type' => 'application/json',
            ]
        ]);
        return json_decode($response->getBody(), true);
    }
}