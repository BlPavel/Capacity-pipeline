import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public title?: string;
  private _subsribe?: Subscription;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router){};

  ngOnInit(): void {
    this._subsribe = this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.title = this._route.root.firstChild?.snapshot.data['title'];
      };
    });
  };
  ngOnDestroy(): void {
    this._subsribe?.unsubscribe();
  };
};
