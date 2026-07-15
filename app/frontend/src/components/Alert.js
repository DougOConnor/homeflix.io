import { Icon } from '@iconify/react/dist/iconify.js';


export default function Alert(props) {
  
  const colors = {
    "success": "bg-green-500",
    "error": "bg-red-500",
    "warning": "bg-yellow-500",
    "info": "bg-blue-100 text-blue-800 border-blue-200 border-solid border-1"
  }

  const icons = {
    "info": <Icon icon="carbon:information" className="text-blue-800" width={24} />
  }

  return (
    <div className={"flex flex-row p-4 mb-6 rounded-md " + colors[props.type] }>
        {icons[props.type]}
        <div className='ml-4'>
            {props.children}
        </div>
    </div>
  );
}
