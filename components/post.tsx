import { IPost } from "@/models/Post";
import { IUser } from "@/models/User";
import Image from "next/image";
import Link from "next/link";
import PlaceholderImage from "@/public/images/placeholder-image.png"
import ProfileImage from "@/public/images/profile.jpg"
import { useEffect, useState } from "react";
import { BiUpvote, BiSolidUpvote } from "react-icons/bi";
export default function Post(props: IPost) {
    const { user, title, description, image, createdAt } = props;
    const [postUser, setPostUser] = useState<IUser>();
    // const [isLiked, setIsLiked] = useState<boolean>(false);
    // const [isDisLiked, setIsDisLiked] = useState<boolean>(false);

    useEffect(() => {
        async function getUser() {
            const res = await fetch(`/api/profile/${user}`, {
                credentials: "include", // This includes cookies in the request
                cache: "no-store" // Prevents caching
            });
            // console.log(res);
            const data = await res.json();
            setPostUser(data);
        }
        getUser();
        // console.log(posts);
    }, [])
    return postUser?.username !== undefined && (
        <>
            <div className="max-w-[900px] mx-auto mb-2">
                <article
                    className="sm:flex gap-6 items-start bg-card/50 p-4 rounded-md border border-border transition-colors duration-300 hover:bg-accent"
                >
                    <div className="w-full md:w-36 h-24 relative flex-shrink-0 rounded overflow-hidden bg-muted">
                        <Image
                            src={image ? image : PlaceholderImage}
                            alt="cover"
                            className="object-cover"
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 33vw"
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold mb-1">{title}</h2>
                        <p className="text-sm text-muted-foreground mb-3">
                            {description && description.length > 250
                                ? `${description.substring(0, 250)}...`
                                : description}
                        </p>
                        <div className="flex items-center justify-between gap-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span className="flex items-center h-8 w-8 rounded-full border-2 border-white">
                                <Image
                                    src={postUser?.avatar || ProfileImage}
                                    alt="user image"
                                    width={32}
                                    height={32}
                                    className="rounded-full w-full h-full"
                                />
                            </span>
                            <Link href={`/profile/${postUser?._id}`}>
                                <span className="text-sm md:text-lg font-semibold">@{postUser?.username}
                                </span>
                            </Link>
                            </div>
                            <div className="flex-col gap-3">
                                <span>
                                    created At : {new Date(createdAt || Date.now()).toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1 opacity-30 cursor-not-allowed">
                                    Upvote <BiUpvote className="text-lg " /> Downvote
                                     <BiUpvote className="text-lg  rotate-180" />
                                </span>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </>
    )
}