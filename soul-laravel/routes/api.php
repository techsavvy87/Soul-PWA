<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\DeckController;
use App\Http\Controllers\api\EventController;
use App\Http\Controllers\api\CardController;
use App\Http\Controllers\api\StatusEmotionController;
use App\Http\Controllers\api\FavoriteController;
use App\Http\Controllers\api\FaqController;
use App\Http\Controllers\api\SettingsController;
use App\Http\Controllers\api\StoreItemController;
use App\Http\Controllers\api\NotificationController;
use App\Http\Controllers\api\PayPalController;
use App\Http\Controllers\api\ProductController;
use App\Http\Controllers\api\PayPalPlanController;
use App\Http\Controllers\api\PayPalWebhookController;
use App\Http\Controllers\api\JournalController;
use App\Http\Controllers\api\ReadingController;
use App\Http\Controllers\api\MeditationController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/signup', [AuthController::class, 'register']);
Route::post('/signup/verify', [AuthController::class, 'verifyRegister']);
Route::post('/forgot/password', [AuthController::class, 'forgotPassword']);
Route::post('/verify/code', [AuthController::class, 'verifyCode']);
Route::post('/reset/password', [AuthController::class, 'resetPassword']);


// Route::post('/paypal/webhook', [PayPalWebhookController::class, 'handleWebhook']);

Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/logout', [AuthController::class, 'logout']);
    
    Route::get('/all-decks', [DeckController::class, 'listDeck']);
    Route::get('/deck-cards/{id}', [DeckController::class, 'listDeckCards']);

    Route::get('/all-events', [EventController::class, 'listEvent']);

    Route::post('/get-cards', [CardController::class, 'getCards']);
    Route::post('/get-adj-cards', [CardController::class, 'getAdjCards']);
    Route::get('/card/detail/{id}', [CardController::class, 'getCardById']);
    Route::post('/send-card-email', [CardController::class, 'sendCardEmail']);

    Route::post('/get-status-emotion', [StatusEmotionController::class, 'getStatusEmotion']);
    
    Route::post('/toggle-favorite', [FavoriteController::class, 'toggleFavorite']);
    Route::post('/check-favorite', [FavoriteController::class, 'checkFavorite']);
    Route::get('/all-favorites', [FavoriteController::class, 'listFavorites']);

    Route::get('/faq/list', [FaqController::class, 'list']);
    Route::get('/about', [SettingsController::class, 'getAbout']);
    Route::get('/creative', [SettingsController::class, 'getCreative']);
    Route::get('/concept', [SettingsController::class, 'getConcept']);

    Route::get('/list-store', [StoreItemController::class, 'listStore']);

    Route::post('/notification/subscribe', [NotificationController::class, 'subscribe']);

    Route::post('/paypal/create-order', [PayPalController::class, 'createOrder']);
    Route::post('/paypal/capture-order', [PayPalController::class, 'captureOrder']);

    Route::get('/product/detail/{id}', [ProductController::class, 'detail']);
    Route::get('/product/purchased/{id}', [ProductController::class, 'purchasedCheck']);

    Route::get('/get-plans', [PayPalPlanController::class, 'getPlans']);
    Route::post('/subscriptions', [PayPalPlanController::class, 'storeSubscription']);
    Route::post('/cancel-subscription', [PayPalPlanController::class, 'cancelSubscription']);
    Route::get('/users/{userId}/subscription/end-date', [PayPalPlanController::class, 'getSubscriptionEndDate']);
    Route::get('/users/{userId}/subscription/status', [PayPalPlanController::class, 'makeFreeSubscription']);

    Route::post('/journal/create', [JournalController::class, 'createJournal']);
    Route::get('/journal/all', [JournalController::class, 'getAllJournals']);
    Route::get('/journal/{id}', [JournalController::class, 'getJournalById']);
    Route::post('/journal/update/{id}', [JournalController::class, 'updateJournal']);
    Route::post('/journal/delete/{id}', [JournalController::class, 'deleteJournal']);

    Route::get('/reading/all', [ReadingController::class, 'listReadings']);
    Route::get('/reading/detail/{id}', [ReadingController::class, 'getReadingById']);
    Route::post('/send-reading-email', [ReadingController::class, 'sendReadingEmail']);

    Route::get('/meditation/all', [MeditationController::class, 'listMeditations']);
    Route::get('/meditation/detail/{id}', [MeditationController::class, 'getMeditationById']);

    Route::get('/app/info', [SettingsController::class, 'appInfo']);
    Route::get('/meditation/info', [SettingsController::class, 'meditationInfo']);
});

// Client-specific on Email reading details
Route::get('/reading/client-detail/{id}', [ReadingController::class, 'getReadingById']);
Route::get('/card/client-detail/{id}', [CardController::class, 'getCardById']);