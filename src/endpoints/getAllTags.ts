import { Tag } from "../entity/tag";

export default async function getAllTags(req: any, res: any) {
    
    const tags: Array<Tag> = await Tag.find({ order: { name: "ASC" }});
    console.log(`getAllTags: found ${tags.length} Tags`);
    res.status(200).send(tags);
}