using System;

namespace ComplianceFunctionApp.Utils
{
    public static class DateFolderHelper
    {
        public static string GetTodayFolder()
        {
            return DateTime.UtcNow.ToString("yyyy-MM-dd");
        }
    }
}
