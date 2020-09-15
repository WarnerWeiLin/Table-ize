import { AfterViewInit, Component, OnInit, ViewChild, ElementRef, Renderer2,} from '@angular/core';
import { MatPaginator, MatTableDataSource, MatTable} from '@angular/material';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Todo } from './model/todo';
import { TodoService } from './service/todo.service';
import { Subscription, Observable, fromEvent } from 'rxjs';

import { Store } from '@ngrx/store';
import { sortStatus } from './model/sort';
import { AppState } from './app.state';
import * as SortActions from './actions/sort.actions';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  todo: Todo[];

  constructor(private service: TodoService, private renderer: Renderer2, private store: Store<AppState>) {
    this.sortStatus = store.select('sortStatus');
  }

  ngOnInit(): void {
    var contextThis = this
    this.setDisplayedColumns();
    this.service.getCustomers().subscribe(async function(customers){
        contextThis.todo = await customers;
        contextThis.dataSource.data = await contextThis.todo;
        contextThis.dataSource.paginator = await contextThis.paginator;
        contextThis.sortStatus.subscribe(ss => contextThis.sortData(ss[ss.length-1]))
      });
    }

  title = 'Table-ize';
  dataSource = new MatTableDataSource();
  isResizing: boolean = false;
  resizingSubscription: Subscription;
  mouseUpSubscription: Subscription;
  sortStatus: Observable<sortStatus[]>;

  columns: any[] = [
    { field: 'id' },
    { field: 'title' },
    { field: 'completed' },
  ];


  displayColumns: string[] = [];

  resizableMousemove: () => void;
  resizableMouseup: () => void;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatTable, { read: ElementRef, static: true || false })
  private matTableRef: ElementRef;



  addSort(status) {
    console.log('addSort invoked', status)
    this.store.dispatch(new SortActions.AddSortStatus(status))
  }




  ngAfterViewInit() {}

  ngOnDestroy() {
    this.resizingSubscription.unsubscribe();
    this.mouseUpSubscription.unsubscribe();
  }


  setDisplayedColumns() {
    this.columns.forEach((column, index) => {
      column.index = index;
      this.displayColumns[index] = column.field;
    });
  }

  sortData($event) {
    const sortId = $event.active;
    const sortDirection = $event.direction;
    if ('asc' == sortDirection) {
      this.dataSource.data = this.todo
        .slice()
        .sort((a, b) =>
          a[sortId] > b[sortId] ? -1 : a[sortId] < b[sortId] ? 1 : 0
        );
    } else {
      this.dataSource.data = this.todo
        .slice()
        .sort((a, b) =>
          a[sortId] < b[sortId] ? -1 : a[sortId] > b[sortId] ? 1 : 0
        );
    }
  }

  openFilter(col: string) {
    document.getElementById(col + '-filter').removeAttribute('hidden');
  }

  closeFilter(col: string) {
    document.getElementById(col + '-filter').setAttribute('hidden', 'true');
  }

  filterData(col: string, filtertext: string) {
    if (filtertext.trim() != '') {
      this.dataSource.data = this.todo
        .slice()
        .filter(
          (element) => JSON.stringify(element[col]).indexOf(filtertext) > -1
        );
    }
  }

  reorderColumns(event) {
    const fromIndex: number = this.displayColumns.indexOf(
      event.previousContainer.id
    );
    const toIndex: number = this.displayColumns.indexOf(event.container.id);
    moveItemInArray(this.displayColumns, fromIndex, toIndex);
  }

  mouseMove$: Observable<MouseEvent> = fromEvent<MouseEvent>(
    document,
    'mousemove'
  );
  mouseUp$: Observable<MouseEvent> = fromEvent<MouseEvent>(document, 'mouseup');

  onResizerClick(event: MouseEvent) {
    event.stopPropagation();
  }

  onResizeColumn(event: MouseEvent, index: number) {
    const tableElm: HTMLTableElement = this.matTableRef.nativeElement;
    const tableRowElm: HTMLTableRowElement = tableElm.tHead.querySelector('tr');
    const headerElm: HTMLTableHeaderCellElement = <HTMLTableHeaderCellElement>(
      tableRowElm.children[index]
    );
    const width: number = tableRowElm.children[index].clientWidth;

    let totalResize: number = 0;
    this.resizingSubscription = this.mouseMove$.subscribe(
      (event: MouseEvent) => {
        totalResize = totalResize + event.movementX;
      }
    );
    this.mouseUpSubscription =
      this.mouseUpSubscription == undefined
        ? this.mouseUp$.subscribe((event: MouseEvent) => {
            headerElm.style.maxWidth = width + totalResize + 'px';
            headerElm.style.width = width + totalResize + 'px';
            this.mouseUpSubscription.unsubscribe();
            this.mouseUpSubscription = undefined;
            this.resizingSubscription.unsubscribe();
          })
        : this.mouseUpSubscription;
    event.stopPropagation();
    event.preventDefault();
  }
}
