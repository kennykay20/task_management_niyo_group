import { Task } from 'src/task/models/task.model';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ length: 500 })
  firstname: string;

  @Column({ length: 500 })
  lastname: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isDelete: boolean;

  @CreateDateColumn({ default: null, type: 'timestamp with time zone' })
  deletedAt: Date;

  @OneToMany(() => Task, (task) => task.userId)
  tasks: Task[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
