export default function Modal({ onClick, updateImg }) {
    function handleChange(event) {
        console.log(event.target.files[0]);
    }

    async function uploadImage(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const awaitingData = await fetch("/api/image", {
            method: "POST",
            body: formData,
        });
        const newImage = await awaitingData.json();
        updateImg(newImage.img_url);
    }

    return (
        <div className="modal">
            <div onClick={onClick} className="x">
                ✖
            </div>
            <form onSubmit={uploadImage}>
                <input
                    onChange={handleChange}
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                />
                <button>Submit</button>
            </form>
        </div>
    );
}
