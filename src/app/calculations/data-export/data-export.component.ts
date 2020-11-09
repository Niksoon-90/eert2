import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-data-export',
  templateUrl: './data-export.component.html',
  styleUrls: ['./data-export.component.scss']
})
export class DataExportComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }


  prevPage() {
    this.router.navigate(['steps/summVolumes']);
  }
}
