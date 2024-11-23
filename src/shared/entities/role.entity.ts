import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Index('pkid_UNIQUE', ['pkid'], { unique: true })
@Index('id_UNIQUE', ['id'], { unique: true })
@Index('role_UNIQUE', ['name'], { unique: true })
@Entity('role', { schema: 'db_bjs' })
export class Role {
  @Column('int', {
    name: 'id',
    unique: true,
  })
  id: number;

  @PrimaryGeneratedColumn({ type: 'int' })
  pkid: number;

  @Column('varchar', {
    name: 'name',
    unique: true,
    length: 20,
  })
  name: string;

  @Column('varchar', {
    name: 'description',
    length: 50,
  })
  description: string;

  @Column('varchar', {
    name: 'group',
    nullable: true,
    length: 45,
  })
  group: string | null;

  @CreateDateColumn({
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date | null;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date | null;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
  })
  deleted_at: Date | null;

  @Column('varchar', {
    name: 'created_by',
    nullable: true,
    length: 45,
  })
  created_by: string | null;

  @Column('varchar', {
    name: 'updated_by',
    nullable: true,
    length: 45,
  })
  updated_by: string | null;

  @Column('varchar', {
    name: 'deleted_by',
    nullable: true,
    length: 45,
  })
  deleted_by: string | null;

  @OneToMany(() => User, (user) => user.role)
  user: User[];
}
