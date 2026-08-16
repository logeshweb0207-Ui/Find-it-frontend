export default function StatCard({

    title,

    value,

    color,

    icon

}) {

    return (

        <div className="
    bg-zinc-900
    rounded-xl
    border
    border-zinc-800
    p-4
    sm:p-5
    w-full
    min-w-0
">

            <div className="flex justify-between items-center">

                <div>

                    <p className="text-sm text-gray-400">

                        {title}

                    </p>

                    <h2 className={`
    text-2xl
    sm:text-3xl
    font-bold
    mt-2
    truncate
    ${color}
`}>

                        {value}

                    </h2>

                </div>

                <div className={`text-4xl ${color} flex items-center justify-center`}>
    {icon}
</div>

            </div>

        </div>

    );

}