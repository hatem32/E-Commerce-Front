import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminUserService } from '../../core/services/AdminUser.service';
import { AdminRole, AdminUser } from '../../core/models/admin.models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(AdminUserService);

  users = signal<AdminUser[]>([]);
  roles = signal<AdminRole[]>([]);
  newRoleName = '';

  editingUserId = signal<string | null>(null);
  editingRoles = new Set<string>();

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(u => this.users.set(u));
  }

  loadRoles(): void {
    this.userService.getRoles().subscribe(r => this.roles.set(r));
  }

  addRole(): void {
    if (!this.newRoleName.trim()) return;

    this.userService.createRole(this.newRoleName.trim()).subscribe(() => {
      this.newRoleName = '';
      this.loadRoles();
    });
  }

  deleteRole(role: AdminRole): void {
    if (!confirm(`Delete role "${role.name}"?`)) return;

    this.userService.deleteRole(role.id).subscribe(() => this.loadRoles());
  }

  startEditRoles(user: AdminUser): void {
    this.editingUserId.set(user.id);
    this.editingRoles = new Set(user.roles);
  }

  toggleRole(roleName: string, checked: boolean): void {
    if (checked) {
      this.editingRoles.add(roleName);
    } else {
      this.editingRoles.delete(roleName);
    }
  }

  saveRoles(user: AdminUser): void {
    this.userService.updateUserRoles(user.id, Array.from(this.editingRoles)).subscribe(() => {
      this.editingUserId.set(null);
      this.loadUsers();
    });
  }

  cancelEdit(): void {
    this.editingUserId.set(null);
  }
}