import { ManyToOne, Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany } from "typeorm";
import { Document } from './document';
import { User } from './user';

@Entity('tag')
export class Tag extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ default: "#000000" })
    colorBackground?: string;

    @Column({ default: "#ffffff" })
    colorForeground?: string;

    @Column({ nullable: true })
    logo?: string;

    @ManyToMany(type => Document, document => document.tags)
    documents: Document[];

    @ManyToOne(type => User, user => user.tags)
    user: User;

}