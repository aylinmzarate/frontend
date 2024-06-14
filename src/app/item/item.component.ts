import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  items: any[] = [];
  filteredItems: any[] = [];
  currentItem: any = {};
  previewUrl: string | ArrayBuffer | null = null;
  searchTerm: string = '';

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.getItems();
  }

  getItems(): void {
    this.itemService.getItems()
      .subscribe((items) => {
        this.items = items;
        this.filteredItems = items;
      });
  }

  getItemById(id: string): void {
    this.itemService.getItemById(id)
      .subscribe((item) => {
        this.currentItem = item;
      });
  }

  createItem(): void {
    if (confirm('¿Estás seguro de agregar este ítem?')) {
      if (this.currentItem._id) {
        this.updateItem(this.currentItem._id, this.currentItem);
      } else {
        this.itemService.createItem(this.currentItem)
          .subscribe(() => {
            this.getItems();
            this.currentItem = {};
            this.previewUrl = null;
          });
      }
    }
  }

  updateItem(id: string, item: any): void {
    if (confirm('¿Estás seguro de actualizar este ítem?')) {
      this.itemService.updateItem(id, item)
        .subscribe(() => {
          this.getItems();
          this.currentItem = {};
          this.previewUrl = null;
        });
    }
  }

  deleteItem(id: string): void {
    if (confirm('¿Estás seguro de eliminar este ítem?')) {
      this.itemService.deleteItem(id)
        .subscribe(() => {
          this.getItems();
        });
    }
  }

  confirmDelete(id: string): void {
    if (confirm('¿Estás seguro de eliminar este ítem?')) {
      this.deleteItem(id);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string | ArrayBuffer;
        this.currentItem.imageUrl = this.previewUrl;
      };
      reader.readAsDataURL(file);
    }
  }

  filterItems(): void {
    this.filteredItems = this.items.filter(item =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  sortItems(property: string): void {
    this.filteredItems.sort((a, b) => a[property].localeCompare(b[property]));
  }

  onSubmit(form: any): void {
    if (form.valid) {
      this.createItem();
    }
  }

  editItem(id: string): void {
    if (confirm('¿Estás seguro de editar este ítem?')) {
      this.getItemById(id);
    }
  }
}
