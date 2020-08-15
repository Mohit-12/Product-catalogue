import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Product } from '../../_models';
import { ProductService } from './product.service';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

    @ViewChild('closebutton') closebutton;
    user: Product;
    products = null;
    form: FormGroup;
    isAddMode: boolean = true;
    loading = false;
    submitted = false;
    fileToUpload: File = null;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private productService: ProductService) {
    }

    ngOnInit() {
        this.productService.getAll()
            .subscribe(products => this.products = products);

        this.form = this.formBuilder.group({
            id: [''],
            title: ['', Validators.required],
            price: [0, Validators.required],
            image: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onFileChange(event) {
        if (event.target.files.length > 0) {
            this.fileToUpload = event.target.files[0];
            this.form.patchValue({
                image: this.fileToUpload
            });
        }
    }
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        if (this.isAddMode) {
            this.createProduct()
        } else {
            this.updateProduct()
        }
    }

    private createProduct() {
        this.f.id.setValue(null);
        const formData = new FormData();
        Object.entries(this.form.value).forEach(
            ([key, value]: any[]) => {
                formData.set(key, value);
            }
        )
        //formData.append('image', this.fileToUpload)

        this.productService.create(formData)
            .subscribe(
                data => {
                    this.closebutton.nativeElement.click();
                    this.ngOnInit()
                },
                error => {
                    this.loading = false;
                });
    }

    private updateProduct() {
        this.isAddMode = true
        this.productService.update(this.form.value.id, this.form.value)
            .subscribe(
                data => {
                    this.closebutton.nativeElement.click();
                    this.ngOnInit()
                },
                error => {
                    this.loading = false;
                });
    }

    editClick(id: string) {
        this.isAddMode = false
        this.productService.getById(id)
            .subscribe(
                x => {
                    this.f.id.setValue(x.id);
                    this.f.title.setValue(x.title);
                    this.f.imageUrl.setValue(x.imageUrl);
                    this.f.price.setValue(x.price);
                },
                error => {
                    this.loading = false;
                });
    }

    deleteClick(id: string) {
        this.productService.delete(id)
            .subscribe(
                data => {
                    this.ngOnInit()
                },
                error => {
                    this.loading = false;
                });
    }

}
