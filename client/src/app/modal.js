export default function Modal({ onClick }) {
    function handleChange(event) {
        console.log(event.target.files[0]);
    }

    function uploadImage(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        console.log(formData);
        /* const awaitingData = await fetch("/api/images", {
                method: "POST",
                body: formData,
            });
            console.log("data", awaitingData);
            const newImage = await awaitingData.json(); */
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
