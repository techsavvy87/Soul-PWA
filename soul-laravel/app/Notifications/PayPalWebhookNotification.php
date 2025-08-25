<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;

class PayPalWebhookNotification extends Notification
{
    use Queueable;

    protected $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function via($notifiable)
    {
        return ['webpush'];
    }

    public function toWebPush($notifiable, $notification)
    {
        return (new WebPushMessage)
            ->title($this->data['title'] ?? 'Notification')
            ->body($this->data['body'] ?? '')
            ->data(array_merge([
                'subscription_id' => $this->data['subscription'] ?? null,
                'event_type' => $this->data['event_type'] ?? null,
            ], $this->data['data'] ?? [])) // Merge context here
            ->options([
                'TTL' => 1000,
            ]);
    }
}