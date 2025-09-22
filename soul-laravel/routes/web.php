<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\web\AuthController;
use App\Http\Controllers\web\DashboardController;
use App\Http\Controllers\web\DeckCardCategoryController;
use App\Http\Controllers\web\EventCategoryController;
use App\Http\Controllers\web\DeckCardController;
use App\Http\Controllers\web\EmotionController;
use App\Http\Controllers\web\GuidanceController;
use App\Http\Controllers\web\FaqController;
use App\Http\Controllers\web\SettingsController;
use App\Http\Controllers\web\StoreItemController;
use App\Http\Controllers\web\NotificationController;
use App\Http\Controllers\web\PayPalPlanController;
use App\Http\Controllers\web\ReadingController;
use App\Http\Controllers\web\MeditationController;

Route::controller(AuthController::class)->group(function () {
    Route::get('/login', 'login')->name('login');
    Route::post('/login/post', 'postLogin')->name('login-post');
});

Route::middleware(['auth'])->group(function (){
    
    Route::controller(AuthController::class)->group(function () {
        Route::get('/logout', 'logout')->name('logout');
    });
    
    Route::controller(DashboardController::class)->group(function () {
        Route::get('/', 'index')->name('dashboard');
    });

    Route::controller(DeckCardCategoryController::class)->group(function () {
        Route::get('/deck-category/list', 'listCategory')->name('list-deck-category');
        Route::post('/deck-category/create', 'createCategory')->name('create-deck-category');
        Route::post('/deck-category/update', 'updateCategory')->name('update-deck-category');
        Route::post('/deck-category/delete', 'deleteCategory')->name('delete-deck-category');
    });


    Route::controller(EventCategoryController::class)->group(function () {
        Route::get('/event-category/list', 'listCategory')->name('list-event-category');
        Route::post('/event-category/create', 'createCategory')->name('create-event-category');
        Route::post('/event-category/update', 'updateCategory')->name('update-event-category');
        Route::post('/event-category/delete', 'deleteCategory')->name('delete-event-category');
    });

    Route::controller(DeckCardController::class)->group(function () {
        Route::get('/deck-cards/list', 'listCards')->name('list-card');
        Route::get('/deck-card/add', 'cardAdd')->name('add-card');
        Route::post('/deck-card/delete', 'cardDelete')->name('delete-card');
        Route::post('/deck-card/create', 'cardCreate')->name('create-card');
        Route::get('/deck-card/edit/{id}', 'cardEdit')->name('edit-card');
        Route::post('/deck-card/update', 'cardUpdate')->name('update-card');
    });

    Route::controller(EmotionController::class)->group(function () {
        Route::get('/emotion/list', 'listEmotions')->name('list-emotion');
        Route::post('/emotion/add', 'addEmotion')->name('add-emotion');
        Route::post('/emotion/update', 'updateEmotion')->name('update-emotion');
        Route::post('/emotion/delete', 'deleteEmotion')->name('delete-emotion');
    });

    Route::controller(GuidanceController::class)->group(function () {
        Route::get('/guidance/list', 'listGuidance')->name('list-guidance');
        Route::post('/guidance/add', 'addGuidance')->name('add-guidance');
        Route::post('/guidance/update', 'updateGuidance')->name('update-guidance');
        Route::post('/guidance/delete', 'deleteGuidance')->name('delete-guidance');
    });

    Route::controller(FaqController::class)->group(function () {
        Route::get('/faq/list', 'listFaq')->name('list-faq');
        Route::get('/faq/add', 'addFaq')->name('add-faq');
        Route::post('/faq/update', 'updateFaq')->name('update-faq');
        Route::post('/faq/delete', 'deleteFaq')->name('delete-faq');
        Route::post('/faq/create', 'createFaq')->name('create-faq');
        Route::get('/faq/edit/{id}', 'editFaq')->name('edit-faq');
    });

    Route::controller(SettingsController::class)->group(function () {
        Route::get('/about/fetch', 'fetchAbout')->name('fetch-about');
        Route::post('/about/save', 'saveAbout')->name('save-about');
        Route::get('/creative/fetch', 'fetchCreative')->name('fetch-creative');
        Route::post('/creative/save', 'saveCreative')->name('save-creative');
        Route::get('/concept/fetch', 'fetchConcept')->name('fetch-concept');
        Route::post('/concept/save', 'saveConcept')->name('save-concept');
    });

    Route::controller(StoreItemController::class)->group(function () {
        Route::get('/store/list', 'listStore')->name('list-store');
        Route::get('/store/new', 'newStoreForm')->name('new-store-form');
        Route::post('/store/create', 'createStore')->name('create-store');
        Route::post('/store/update', 'updateStore')->name('update-store');
        Route::post('/store/delete', 'deleteStore')->name('delete-store');
        Route::get('/store/edit/{id}', 'editStore')->name('edit-store');
    });

    Route::controller(NotificationController::class)->group(function () {
        Route::get('/notification/send/{id}', 'send')->name('send-notification');
        Route::get('/notification/list', 'list')->name('list-notification');
        Route::get('/notification/add', 'add')->name('add-notification');
        Route::post('/notification/create', 'create')->name('create-notification');
        Route::get('/notification/edit/{id}', 'edit')->name('edit-notification');
        Route::post('/notification/update', 'update')->name('update-notification');
        Route::post('/notification/delete', 'delete')->name('delete-notification');
    });

    Route::controller(PayPalPlanController::class)->group(function () {
        Route::get('/plan/list', 'listPlans')->name('list-plan');
        Route::get('/plan/create/form', 'createPlanForm')->name('create-plan-form');
        Route::post('/plan/store', 'storePlan')->name('store-plan');
        Route::get('/plan/edit/{id}', 'editPlan')->name('edit-plan');
        Route::post('/plan/update', 'updatePlan')->name('update-plan');
        Route::post('/plan/archive', 'archivePlan')->name('archive-plan');
        Route::post('/plan/unarchive', 'unarchivePlan')->name('unarchive-plan');
    });

    Route::controller(ReadingController::class)->group(function () {
        Route::get('/reading/list', 'listReadings')->name('list-reading');
        Route::post('/reading/add', 'addReading')->name('add-reading');
        Route::post('/reading/update', 'updateReading')->name('update-reading');
        Route::post('/reading/delete', 'deleteReading')->name('delete-reading');
    });

    Route::controller(MeditationController::class)->group(function () {
        Route::get('/meditation/list', 'listMeditations')->name('list-meditation');
        Route::get('/meditation/add', 'addMeditation')->name('add-meditation');
        Route::post('/meditation/create', 'createMeditation')->name('create-meditation');
        Route::get('/meditation/edit/{id}', 'editMeditation')->name('edit-meditation');
        Route::post('/meditation/update', 'updateMeditation')->name('update-meditation');
        Route::post('/meditation/delete', 'deleteMeditation')->name('delete-meditation');
    });

    Route::get('/cards', [DeckCardController::class, 'listCards'])->name('cards.index');
    Route::get('/emotions', [EmotionController::class, 'listEmotions'])->name('emotions.index');
    Route::get('/guidances', [GuidanceController::class, 'listGuidance'])->name('guidances.index');
});