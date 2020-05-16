using System;
using System.Reflection;
using System.Runtime.Loader;

namespace transfersUtils {
    internal class CustomAssemblyLoadContext : AssemblyLoadContext {
        public IntPtr LoadUnmanagedLibrary(string absolutePath) =>
            LoadUnmanagedDll(absolutePath);

        protected override IntPtr LoadUnmanagedDll(String unmanagedDllName) =>
            LoadUnmanagedDllFromPath(unmanagedDllName);

        protected override Assembly Load(AssemblyName assemblyName) =>
            throw new NotImplementedException();
    }
}