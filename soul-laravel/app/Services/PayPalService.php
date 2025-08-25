<?php

namespace App\Services;

use GuzzleHttp\Client;

class PayPalService
{
    protected $client;
    protected $baseUrl;

    protected $clientId;
    protected $secret;
    


    public function __construct()
    {
        $this->baseUrl = config('paypal.mode') === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';

        $this->client = new Client();
        
        // Load PayPal credentials from environment variables
        $this->clientId = env('PAYPAL_CLIENT_ID');
        $this->secret = env('PAYPAL_SECRET');
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

    // Create a new product in the PayPal catalog
    public function createProduct($name, $description)
    {
        $accessToken = $this->getAccessToken();

        $response = $this->client->post($this->baseUrl . '/v1/catalogs/products', [
            'headers' => [
                'Authorization' => 'Bearer ' . $accessToken,
                'Content-Type' => 'application/json'
            ],
            'json' => [
                'name' => $name,
                'description' => $description,
                'type' => 'SERVICE',
                'category' => 'SOFTWARE'
            ]
        ]);

        return json_decode($response->getBody()->getContents(), true);
    }

    /**
     *  Create a new subscription plan
     */
    public function createPlan($productId, $name, $price, $intervalUnit, $intervalCount = 1)
    {
        $accessToken = $this->getAccessToken();

        $response = $this->client->post($this->baseUrl . '/v1/billing/plans', [
            'headers' => [
                'Authorization' => 'Bearer ' . $accessToken,
                'Content-Type' => 'application/json'
            ],
            'json' => [
                'product_id' => $productId,
                'name' => $name,
                'billing_cycles' => [
                    [
                        'frequency' => [
                            'interval_unit' => $intervalUnit,
                            'interval_count' => $intervalCount
                        ],
                        'tenure_type' => 'REGULAR',
                        'sequence' => 1,
                        'total_cycles' => 0,
                        'pricing_scheme' => [
                            'fixed_price' => [
                                'value' => number_format($price, 2, '.', ''),
                                'currency_code' => 'USD'
                            ]
                        ]
                    ]
                ],
                'payment_preferences' => [
                    'auto_bill_outstanding' => true,
                    'setup_fee' => ['value' => '0', 'currency_code' => 'USD'],
                    'setup_fee_failure_action' => 'CONTINUE',
                    'payment_failure_threshold' => 3
                ]
            ]
        ]);

        return json_decode($response->getBody()->getContents(), true);
    }

    /**
     *  Update an existing subscription plan
     */
    public function updatePlan(string $planId, array $data)
    {
        $accessToken = $this->getAccessToken();

        $operations = [
            [
                "op" => "replace",
                "path" => "/payment_preferences/payment_failure_threshold",
                "value" => 7
            ],
            [
                "op" => "replace",
                "path" => "/name",
                "value" => $data['name']
            ],
            [
                "op" => "add",
                "path" => "/description",
                "value" => $data['description']
            ],

        ];

        $response = $this->client->patch("{$this->baseUrl}/v1/billing/plans/{$planId}", [
            'headers' => [
                'Authorization' => 'Bearer ' . $accessToken,
                'Content-Type'  => 'application/json',
            ],
            'json' => $operations
        ]);

        return json_decode($response->getBody(), true);

        
    }

    public function archivePlan($planId)
    {
        $accessToken = $this->getAccessToken();

        try {
            $this->client->post($this->baseUrl . "/v1/billing/plans/{$planId}/deactivate", [
                'headers' => [
                    'Authorization' => "Bearer {$accessToken}",
                    'Content-Type'  => 'application/json'
                ]
            ]);

            return ['status' => 'success', 'message' => 'Plan archived successfully'];

        } catch (\GuzzleHttp\Exception\ClientException $e) {
            $responseBody = (string)$e->getResponse()->getBody();
            throw new \Exception("PayPal archive plan failed: " . $responseBody);
        }
    }

    public function unarchivePlan($planId)
    {
        $accessToken = $this->getAccessToken();

        try {
            $this->client->post($this->baseUrl . "/v1/billing/plans/{$planId}/activate", [
                'headers' => [
                    'Authorization' => "Bearer {$accessToken}",
                    'Content-Type'  => 'application/json'
                ]
            ]);

            return ['status' => 'success', 'message' => 'Plan activated successfully'];

        } catch (\GuzzleHttp\Exception\ClientException $e) {
            $responseBody = (string)$e->getResponse()->getBody();
            throw new \Exception("PayPal activate plan failed: " . $responseBody);
        }
    }

    /**
     * Cancel a subscription
     */
    public function cancelSubscription($subscriptionId, $reason = 'User requested cancellation')
    {
        $accessToken = $this->getAccessToken();
        if (!$accessToken) {
            throw new \Exception("Unable to get PayPal access token.");
        }

        $response = $this->client->post("{$this->baseUrl}/v1/billing/subscriptions/{$subscriptionId}/cancel", [
            'headers' => [
                'Authorization' => "Bearer $accessToken",
                'Content-Type'  => 'application/json',
            ],
            'json' => [
                'reason' => $reason
            ]
        ]);

        // PayPal returns 204 No Content on success
        if ($response->getStatusCode() === 204) {
            return true;
        }

        return false;
    }
}