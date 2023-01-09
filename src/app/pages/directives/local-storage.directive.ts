import { LocalStorageService } from './../services/local-storage.service';
import { FormGroup } from '@angular/forms';
import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[autoSaveInLS]'
})
export class LocalStorageDirective implements OnDestroy, OnInit {
  @Input()
  public form!: FormGroup;

  @Input()
  public key!: string;

  private _subscription?: Subscription;

  constructor(private readonly _LS: LocalStorageService){};

  ngOnInit(): void {
    this._subscription = this.form.valueChanges.
    pipe(debounceTime(100))
    .subscribe((value)=>{
      this._LS.set(this.key, value)
    });
  };

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  };
};
