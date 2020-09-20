<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResources([
    'user' => 'API\UserController',
    'categories' => 'API\ExpenseCategoryController',
    'expenses' => 'API\ExpensesController',
    'user-expenses' => 'API\UserExpenseController',
]);

Route::get('profile', 'API\UserController@profile');
Route::put('profile', 'API\UserController@updateProfile');
Route::get('findUser', 'API\UserController@search');
Route::get('allCategories', 'API\ExpenseCategoryController@allData');
Route::get('allExpenses', 'API\ExpensesController@allData');
Route::get('allUsers', 'API\UserController@allData');
