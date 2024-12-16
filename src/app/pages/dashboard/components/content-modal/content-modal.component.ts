import { ChangeDetectionStrategy, Component, inject, input, type OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';


import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


  

interface Content{
  id: string;
  thumbnail: string;
  subject: string;
  topic: string;
  description: string;
  detailedDescription: string;
  isEnrolled: boolean;
}

@Component({
  selector: 'app-content-modal',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './content-modal.component.html',
  styleUrl: './content-modal.component.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ContentModalComponent implements OnInit {

  content = input.required<Content>();
  readonly data = inject<Content>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ContentModalComponent>)
  ngOnInit(): void {
    console.log(this.data)
   }
   

  close() {
    this.dialogRef.close(); // Close the modal without returning data
  }

}
