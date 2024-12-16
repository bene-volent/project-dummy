import { Component, input, type OnInit } from '@angular/core';

@Component({
  selector: 'app-cards-section',
  imports: [],
  templateUrl: './cards-section.component.html',
  styles: [`
    .dashboard-cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
}`]
})
export class CardsSectionComponent implements OnInit {

  sectionTitle = input.required<string>({alias: 'title'});

  ngOnInit(): void { 
    console.log(this.sectionTitle())
  }

}
