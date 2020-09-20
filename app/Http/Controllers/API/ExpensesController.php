<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Expenses;

class ExpensesController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // if (\Gate::allows('isAdmin')) {
            return Expenses::latest()->paginate(5);
        // }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->authorize('isAdmin');
        $this->validate($request, [
            'ExpenseName' => 'required|string|max:255',
            'category_id' => 'required',
            'amount' => 'numeric|between:0,9999999999.99',
        ]);

        return Expenses::create([
            'ExpenseName' => $request['ExpenseName'],
            'category_id' => $request['category_id'],
            'amount' => $request['amount'],
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->authorize('isAdmin');
        $expense = Expenses::findOrFail($id);
        $this->validate($request, [
            'ExpenseName' => 'required|string|max:255',
            'category_id' => 'required',
            'amount' => 'numeric|between:0,9999999999.99',
        ]);
        
        $expense->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->authorize('isAdmin');
        $expense = Expenses::findOrFail($id);
        $expense->delete();
    }

    public function allData()
    {
        return Expenses::all();
    }
}
