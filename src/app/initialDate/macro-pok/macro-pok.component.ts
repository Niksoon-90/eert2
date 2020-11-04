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
  cargoGroup = [
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
  shipmentType = [
    {id:1, name:"Внутренние"},
    {id:2, name:"Экспорт"},
    {id:3, name:"Импорт"},
    {id:4, name:"Транзит"},
  ]
  macroIndex: string;
  year
  valueMacro: string;

  ngOnInit(): void {
    this.getMacroPok()
  }

  getMacroPok(){
    this.shipmentsService.getMacroPok().subscribe(
      res => {this.macroPokList = res; console.log(res)},
      err => console.log('HTTP Error', err.message),
      () => console.log('HTTP request completed.')
    )
  }

}
