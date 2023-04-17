import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { Post } from 'src/app/providers/post';
import { PostService } from 'src/app/services/posts/post.service';
import { EditPostComponent } from './edit-post/edit-post.component';
import { MenusService } from 'src/app/services/menus/menus.service';
import { Menu } from 'src/app/providers/menu';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, AfterViewInit {

  postDeteils: Post = {
    title: '',
    menu_id: '',
    content: ''

  }

  menusList: Menu[];

  postForm: FormGroup;

  displayedColumns: string[] = ['id', 'title', 'menu_id', 'content', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private menus: MenusService,
    private posts: PostService,
    public dialog: MatDialog,
    private fb: FormBuilder
    ) {
      this.postForm = this.fb.group({
        title: ['', Validators.required],
        menu_id: ['', Validators.required],
        content: ['', Validators.required]
      })
  }

  ngOnInit(): void {
    this.posts.getPosts().subscribe(
      data => {
        this.dataSource.data = data; 
      }
    )
    this.menus.getMenus().subscribe(
      data => {
        this.menusList = data; 
      }
    )
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addPost() {
    if (this.postForm.valid) {
      this.posts.addPost(this.postForm.value);
    }
    
  }

  editPost(postId: string, post: Post) {
    this.posts.updatePost(postId, post);
  }

  deletePost(postId: string) {
    this.posts.deletePost(postId);
  }

  openDialog(postId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === "true") {
        this.deletePost(postId);
      }
    });
  }

  openEditDialog(postId: string, title: string, menu_id: string, content: string): void {
    const dialogRef = this.dialog.open(EditPostComponent, {
      data: {title, menu_id, content, 'menus': this.menusList},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== "false" && result) {
        this.editPost(postId, result)
      }
    });
  }
}