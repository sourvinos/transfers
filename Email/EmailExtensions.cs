using Microsoft.Extensions.DependencyInjection;

namespace Transfers.Email {

    public static class AddEmailExtensions {

        public static IServiceCollection AddEmailSenders(this IServiceCollection services) {

            services.AddTransient<IEmailSender, SendOutlookEmail>();

            return services;

        }

    }

}