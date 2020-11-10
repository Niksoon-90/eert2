import { Component, OnInit } from '@angular/core';
import {ShipmentsService} from "../../services/shipments.service";
import {IMacroPokModel} from "../../models/macroPok.model";
import {MessageService} from "primeng/api";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-macro-pok',
  templateUrl: './macro-pok.component.html',
  styleUrls: ['./macro-pok.component.scss'],
  providers: [MessageService]
})
export class MacroPokComponent implements OnInit {

  constructor(
    private shipmentsService: ShipmentsService) { }

  macroPokList: IMacroPokModel[];
  form: FormGroup
  years = [];
  cargoGroups = [
    {id:1, name:"Уголь"},
    {id:2, name:"Кокс"},
    {id:3, name:"Нефтяные грузы"},
    {id:4, name:"Рудные грузы"},
    {id:5, name:"Черные металлы"},
    {id:6, name:"Лесные грузы"},
    {id:7, name:"Минеральные строительные материалы"},
    {id:8, name:"Удобрения"},
    {id:9, name:"Хлебные грузы"},
    {id:10, name:"Прочие грузы"},
  ];
  shipmentTypes = [
    {id:1, name:"Внутренние"},
    {id:2, name:"Экспорт"},
    {id:3, name:"Импорт"},
    {id:4, name:"Транзит"},
  ]


  ngOnInit(): void {
    this.getMacroPok()
    this.createForm()
    this.years = [];
    for (let i = 15; i <= 99; i++) {
      this.years.push({name: `20`+i});
    }
  }
  createForm(){
    this.form = new FormGroup({
      cargoGroup: new FormControl('',[Validators.required]),
      shipmentType: new FormControl('', [Validators.required]),
      year: new FormControl('', [Validators.required]),
      macroIndex: new FormControl('', [Validators.required]),
      pissyValueMacro: new FormControl('', [Validators.required]),
      optimisticValueMacro: new FormControl('', [Validators.required]),
      basicValueMacro: new FormControl('', [Validators.required]),
    })
  }
  resetForm(){
    this.form.reset({
      cargoGroup: '',
      shipmentType: '',
      year: '',
      macroIndex: '',
      pissyValueMacro: '',
      optimisticValueMacro: '',
      basicValueMacro: ''
    })
  }

  getMacroPok(){
    this.shipmentsService.getMacroPok().subscribe(
      res => this.macroPokList = res,
      err => console.log('HTTP Error', err.message),
      () => console.log('HTTP request completed.')
    )
  }

  saveNewMacroPok(value) {
     const macroPok: IMacroPokModel = {
       cargoGroup:	value.cargoGroup['name'],
       macroIndex:	value.macroIndex,
       shipmentType:	value.shipmentType['name'],
       valueLow: value.pissyValueMacro,
       valueHigh: value.optimisticValueMacro,
       valueMedium: value.basicValueMacro,
       year: value.year['name']
     }
     console.log(macroPok)
     this.shipmentsService.postMacroPok(macroPok).subscribe(
       res => {
         this.getMacroPok();
         this.resetForm();
       }
     )
  }

  onRowEditInit(macroPok: any) {
    console.log(macroPok)
  }

  onRowEditSave(macroPok: any) {
    console.log(JSON.stringify(macroPok))
    this.shipmentsService.putMacroPok(macroPok).subscribe(
      res => { console.log(res)},
      err => console.log('HTTP Error', err.message),
      () => this.getMacroPok()
    )
  }

  onRowEditCancel(macroPok: any, ri) {
    console.log(macroPok)
  }
}
