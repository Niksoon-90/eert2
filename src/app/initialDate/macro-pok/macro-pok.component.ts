import { Component, OnInit } from '@angular/core';
import {ShipmentsService} from "../../services/shipments.service";
import {IMacroPokModel} from "../../models/macroPok.model";
import {MessageService} from "primeng/api";

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

  cargoGroup: string;
  shipmentType: string;
  macroIndex: string;
  year: number;
  pissyValueMacro: string;
  optimisticValueMacro: string;
  basicValueMacro: number;

  ngOnInit(): void {
    this.getMacroPok()
    this.years = [];
    for (let i = 15; i <= 99; i++) {
      this.years.push({name: `20`+i});
    }
  }

  getMacroPok(){
    this.shipmentsService.getMacroPok().subscribe(
      res => this.macroPokList = res,
      err => console.log('HTTP Error', err.message),
      () => console.log('HTTP request completed.')
    )
  }

  saveNewMacroPok() {
    const macroPok: IMacroPokModel = {
      cargoGroup:	this.cargoGroup['name'],
      macroIndex:	this.macroIndex,
      shipmentType:	this.shipmentType['name'],
      value: this.basicValueMacro,
      year: this.year
    }
    console.log(macroPok)
    this.shipmentsService.postMacroPok(macroPok).subscribe(
      res => {
        console.log(res)
        this.getMacroPok()
      }
    )
  }
}
