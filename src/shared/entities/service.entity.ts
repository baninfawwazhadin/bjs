import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Area } from './area.entity';
import { Company } from './company.entity';
import { Product } from './product.entity';

@Index('pkid_UNIQUE', ['id'], { unique: true })
@Index('service_id_UNIQUE', ['service_pkid'], { unique: true })
@Index('area_id_idx', ['area_pkid'], {})
@Index('product_id_idx', ['product_pkid'], {})
@Index('company_pkid_idx', ['company_pkid'], {})
@Entity('service', { schema: 'db_bjs' })
export class Service {
  @Column('int', {
    name: 'id',
    unique: true,
  })
  id: number;

  @PrimaryColumn({ type: 'varchar' })
  service_pkid: string;

  @Column('varchar', {
    name: 'company_pkid',
    length: 10,
  })
  company_pkid: string;

  @Column('varchar', {
    name: 'area_pkid',
    length: 5,
  })
  area_pkid: string;

  @Column('enum', {
    name: 'person_type',
    enum: ['TKA', 'Dependant', 'Tamu', 'Lainnya'],
  })
  person_type: 'TKA' | 'Dependant' | 'Tamu' | 'Lainnya';

  @Column('varchar', {
    name: 'product_pkid',
    length: 5,
  })
  product_pkid: string;

  @Column('varchar', {
    name: 'name',
    length: 50,
  })
  name: string;

  @Column('decimal', {
    name: 'price',
    precision: 20,
    scale: 5,
  })
  price: string;

  @Column('varchar', {
    name: 'SLA',
    length: 50,
  })
  SLA: string;

  @Column('tinyint', {
    name: 'is_active',
    width: 1,
    default: () => "'1'",
  })
  is_active: boolean;

  @CreateDateColumn({
    select: false,
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date | null;

  @UpdateDateColumn({
    select: false,
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date | null;

  @DeleteDateColumn({
    select: false,
    name: 'deleted_at',
    nullable: true,
  })
  deleted_at: Date | null;

  @Column('varchar', {
    select: false,
    name: 'created_by',
    nullable: true,
    length: 45,
  })
  created_by: string | null;

  @Column('varchar', {
    select: false,
    name: 'updated_by',
    nullable: true,
    length: 45,
  })
  updated_by: string | null;

  @Column('varchar', {
    select: false,
    name: 'deleted_by',
    nullable: true,
    length: 45,
  })
  deleted_by: string | null;

  @ManyToOne(() => Area)
  @JoinColumn([{ name: 'area_pkid', referencedColumnName: 'pkid' }])
  area: Area;

  @ManyToOne(() => Company)
  @JoinColumn([{ name: 'company_pkid', referencedColumnName: 'pkid' }])
  company: Company;

  @ManyToOne(() => Product)
  @JoinColumn([{ name: 'product_pkid', referencedColumnName: 'pkid' }])
  product: Product;
}
