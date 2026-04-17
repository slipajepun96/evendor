<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\ProcurementList;

class ProcurementListController extends Controller
{
    public function viewProcurementList()
    {
        $procurement = ProcurementList::orderBy('procurement_close_date', 'desc')->get();
        return Inertia::render('Admin/Procurement/ProcurementView', [
            'procurement' => $procurement
        ]);
    }

    public function addProcurement(Request $request)
    {
        
        $validatedData = $request->validate([
            'procurement_title' => 'required|string|max:255',
            'procurement_description' => 'required|string',
            'procurement_open_date' => 'required|date',
            'procurement_close_date' => 'required|date|after_or_equal:procurement_open_date',
            'procurement_pdf_address' => 'required|url',
        ]);

        $procurement_list = new ProcurementList();
        $procurement_list->procurement_title = $validatedData['procurement_title'];
        $procurement_list->procurement_description = $validatedData['procurement_description'];
        $procurement_list->procurement_open_date = $validatedData['procurement_open_date'];
        $procurement_list->procurement_close_date = $validatedData['procurement_close_date'];
        $procurement_list->procurement_pdf_address = $validatedData['procurement_pdf_address'];
        $procurement_list->save();

        return redirect()->route('procurement.index')->with('success', 'Procurement added successfully');
    }
}
