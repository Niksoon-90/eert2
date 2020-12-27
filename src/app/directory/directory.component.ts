import { Component, OnInit } from '@angular/core';
import {ICargoOwnerInfluenceFactor, IInfluenceNci} from "../models/calculations.model";

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss']
})
export class DirectoryComponent implements OnInit {
  influenceNci: ICargoOwnerInfluenceFactor[]

  constructor() { }

  ngOnInit(): void {
  }

}
