export default function ReviewForm() {
    return (
        <div className="flex flex-col gap-4 border border-base-content/20 rounded-sm">
            <div className="px-8 py-4 bg-base-200 border-b border-base-content/20">
                <h1 className="font-bold text-xl">Write a Review</h1>
            </div>
            <div className="flex flex-col gap-4 px-8 py-4">
                <div className="flex flex-col">
                    <label className="label text-sm text-base-content font-bold">Add a title</label>
                    <input type="text" className="input w-full" />
                </div>
                <div className="flex flex-col">
                    <label className="label text-sm text-base-content font-bold">Details please! Your review helps other shopppers</label>
                    <textarea className="textarea w-full"></textarea>
                </div>
                <div className="flex flex-col">
                    <label className="label text-sm text-base-content font-bold">Select a rating star</label>
                    <select defaultValue={1} className="select w-full">
                        <option value={1}>1 Star</option>
                        <option value={2}>2 Star</option>
                        <option value={3}>3 Star</option>
                        <option value={4}>4 Star</option>
                        <option value={5}>5 Star</option>
                    </select>
                </div>
            </div>
            <div className="flex border-t border-base-content/20 p-4 justify-center">
                <button className="btn text-bold text-lg rounded-sm">Submit Review</button>
            </div>
        </div>
    );
}