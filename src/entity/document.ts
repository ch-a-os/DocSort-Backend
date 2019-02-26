import { UpdateDateColumn, Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable, ManyToOne, CreateDateColumn } from "typeorm";
import { Tag } from './tag';
import { User } from "./user";

@Entity('document')
export class Document extends BaseEntity {

    @PrimaryGeneratedColumn()
    uid: number;

    @Column()
    primaryNumber: number;

    @Column({ nullable: true })
    secondaryNumber?: number;

    @Column()
    fileExtension: string;

    @Column({ nullable: true })
    title?: string;

    @Column({ nullable: true })
    note?: string;

    @ManyToOne(type => User, user => user.documents, { nullable: false })
    user: User;

    @ManyToMany(type => Tag, tag => tag.documents)
    @JoinTable()
    tags: Tag[];

    @Column({ nullable: true })
    mimeType?: string;

    // OCR
    @Column({ nullable: true, default: false })
    ocrEnabled?: boolean;

    @Column({ nullable: true, default: false })
    ocrFinished?: boolean;

    @Column({ nullable: true })
    ocrText?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}