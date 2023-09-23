import React, { ErrorInfo, ReactNode} from 'react';

interface Props{
    children?: ReactNode;
}

interface State{
    hasError:boolean,
    error:unknown,
    errorInfo:ErrorInfo|null
}

class ErrorBoundary extends React.Component<Props,State>{
    constructor(props:Props){
        super(props);
        this.state={hasError:false,error:null,errorInfo:null};
    }

   public static getDerivedStateFromError(error:unknown){
    console.error(error)
    return {hasError:true}
   }

   public componentDidCatch(error:unknown,errorInfo:ErrorInfo){
    this.setState({
        hasError:true,
        error,
        errorInfo,
    })
    console.error(errorInfo.componentStack)
   }

   public render(){
    if(this.state.hasError){
        return<h1>Sorry.. there was an error</h1>
    }
   }
}

export default ErrorBoundary;
